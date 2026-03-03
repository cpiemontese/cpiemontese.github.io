# XML Parsing in Elixir: how to bring down your memory usage and not get OOM Killed by k8s

## Introduction

A key part of the insurance business is deciding who to insure. Many properties
are taken into consideration and one of the most important ones is whether an
entity - be it a person, vehicle, company and so on - has been **sanctioned** by
some government. Different sanctions lists are kept updated by their respective
governments and are available online freely (e.g.
[the UK Sanctions List](https://www.gov.uk/government/publications/the-uk-sanctions-list)).
These can be used to determine if an entity is subject to any sanctions and thus
if they are - or not - a good candidate to insure.

These lists come in different formats and usually - to be machine readable -
they are available as XML documents. These documents can range from a few
hundred kilobytes to tens of megabytes and can contain a few thousand up to tens
of thousands of entries (with 20k being the largest). Since the lists can be
updated frequently and are not always backward compatible, we use a cron job
that runs daily and has to download, parse and write all entries to the
database.

We managed to nail the downloading and writing ~40k entries to the database
part. Unfortunately, we had huge memory spikes during the actual parsing of the
XML files, which went as high as 9GiB and averaged 1GiB per run. This meant that
we had to either request a lot of memory to Kubernetes just to be safe or risk
getting OOM Killed, which started happening too frequently. This situation was
not sustainable.

## A brief detour into XML parsing

To understand why this was happening, let's back up a bit and take a detour into
the wonderful world of XML parsing.

There are at least two ways to parse an XML file: you can load it all up in
memory or you can read it as a stream of data. These two modes are called DOM
and SAX respectively. They differ in that DOM parsing is more expensive for
memory, since it has to read the whole file to create the DOM tree, while SAX
parsing reads the file and generates events each time an XML tag is opened or
closed. DOM parsing is a lot more ergonomic since you can run queries using
XPath, but SAX parsing is more scalable.

In the Erlang ecosystem, the main library for XML parsing is **xmerl**, which
offers both DOM and SAX modes. Many libraries are based on it and **SweetXML**,
the library we used, is a thin Elixir wrapper around it. SweetXML, as the name
suggests, is a really sweet library to use but it inherits both merits and
faults of xmerl, namely a high memory footprint, especially when not using the
streaming API. While SweetXML offers options to reduce memory usage, e.g.
element streaming and a `discard` option to
[avoid construction of the whole tree](https://github.com/kbrw/sweet_xml/issues/57#issuecomment-361708573),
it didn't fully solve our problem. This led us to search for solutions
elsewhere.

We had various ideas on how to fix this problem. There are external services
that offer solutions to query these sanctions lists, but that didn't make sense
for our use case. We also thought about rewriting the import service in Rust,
the other main language in Prima, to get that juicy blazingly™️ fast speed. In
the end, since we had a lot of machinery written in Elixir already, we decided
to try out a SAX parser.

There are quite a few SAX parsers for Erlang/Elixir, like **erlsom**,
**fast_xml** and **yaccety_sax**, all of which would probably speed up parsing.
Unfortunately, none of those were appealing since the code you end up with is
often not that readable and their interface is not that user-friendly. Among
these tough, we found **Saxy**, which proved to be both ergonomic and fast.

## From DOM to SAX

The translation from a DOM implementation using XPath to a SAX one is not
straightforward, since with XPath you can just query a document whereas with SAX
you have to build your internal representation from sequential events.

Let's suppose we have a simple XML as input:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<teams>
  <team>
      <id>1</id>
      <name>Team One</name>
  </team>
  <team>
      <id>2</id>
      <name>Team Two</name>
  </team>
</teams>
```

Here are a few queries we might perform on this document using SweetXml:

```elixir
doc |> xpath(~x"//teams/team/name/text()") # 'Team One'
doc |> xpath(~x"//teams/team/id/text()"l) # ['1', '2']
```

As you can see, queries are quite straightforward. Here's what a Saxy
implementation might look like:

```elixir
defmodule SaxyParser do
  @behaviour Saxy.Handler

  @impl true
  def handle_event(:start_document, _, state) do
    {:ok, state}
  end

  def handle_event(:end_document, _, state) do
    {:ok, state}
  end

  def handle_event(:start_element, {name, _}, {elements, teams}) do
    teams =
      case name do
        "team" ->
          [%{} | teams]

        _ ->
          teams
      end

    {:ok, {[name | elements], teams}}
  end

  def handle_event(:end_element, _, {[_ | elements], teams}) do
    {:ok, {elements, teams}}
  end

  def handle_event(:characters, chars, {[element | elements], teams}) do
    teams =
      case element do
        _ when element in ["name", "id"] ->
          teams
          |> List.first(%{})
          |> Map.put(element, chars)
          |> then(&List.replace_at(teams, 0, &1))

        _ ->
          teams
      end

    {:ok, {[element | elements], teams}}
  end
end
```

This is widely different from using XPath: instead of issuing multiple queries
on the document to fetch the data we need, we have to build the output tag by
tag, keeping track of which tag we are reading, which we have already read and
so on. While the code might be less appealing than its DOM version, Saxy offers
a very simple _behaviour_, which can be implemented to create a self-contained
parser. Moreover, readability can improve a lot if the state is handled by a
separate module, thus hiding all its internal details.

## Results

As mentioned, Saxy is pretty fast and much lighter on the memory. Here is a
snapshot of CPU and memory usage around the release of the updated cron job,
which happened on the 20th of May

![CPU around release](pictures/CPU%20around%20release.png 'CPU usage around the release')

![Memory around release](pictures/Memory%20around%20release.png 'Memory usage around the release')

After releasing the updated cron job, we can see a sharp decline in memory usage
and, surprisingly, a decrease in CPU usage too. To get a better idea of the
impact of this refactoring, here is the CPU and memory usage during a larger
time frame (February to July)

![CPU 5 months](pictures/CPU%20whole%20range.png 'CPU usage within 5 months')

![Memory 5 months](pictures/Memory%20usage%20whole%20range.png 'Memory usage within 5 months')

While CPU usage varies quite a bit, we can safely say that it has seen a 20% to
30% decrease. Memory usage on the other hand decreased by about 90% and is more
or less stable at 100MiB.

Since we set out to avoid getting OOM Killed and reduce memory usage as much as
possible, these results indicate that we can consider our refactor successful.

Finally, we also noticed one added benefit that we didn't set out to achieve and
thus didn't expect: the cron job runtime was halved. Before this refactor the
cron job took around 2 minutes to complete, while now it takes about 1 minute.
While performance is not our primary concern, it was a nice surprise indeed.

## References

- <https://stackoverflow.com/questions/6828703/what-is-the-difference-between-sax-and-dom>
- <https://github.com/kbrw/sweet_xml/issues/57>
