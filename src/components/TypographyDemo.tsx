import { 
  H1,
  H2,
  H3,
  H4,
  P,
  Blockquote,
  InlineCode,
  Lead,
  Large,
  Small,
  Muted,
  List
} from "@/components/atom/typography"

export function TypographyDemo() {
  return (
    <div className="space-y-8">
      <div>
        <H1>The Joke Tax Chronicles</H1>
        <Lead>
          Once upon a time, in a far-off land, there was a very lazy king who spent all day lounging on his throne.
        </Lead>
      </div>

      <div>
        <H2>The King&apos;s Plan</H2>
        <P>
          The king thought long and hard, and finally came up with a brilliant plan: he would tax the jokes in the kingdom.
        </P>
        <Blockquote>
          &quot;After all,&quot; he said, &quot;everyone enjoys a good joke, so it&apos;s only fair that they should pay for the privilege.&quot;
        </Blockquote>
      </div>

      <div>
        <H3>The Joke Tax</H3>
        <P>
          The king&apos;s subjects were not amused. They grumbled and complained, but the king was firm:
        </P>
        <List>
          <li>1st level of puns: 5 gold coins</li>
          <li>2nd level of jokes: 10 gold coins</li>
          <li>3rd level of one-liners: 20 gold coins</li>
        </List>
        <P>
          As a result, people stopped telling jokes, and the kingdom fell into a gloom. But there was one person who refused to let the king&apos;s foolishness get him down: a court jester named Jokester.
        </P>
      </div>

      <div>
        <H4>Jokester&apos;s Revolt</H4>
        <P>
          Jokester began sneaking into the castle in the middle of the night and leaving jokes all over the place: under the king&apos;s pillow, in his soup, even in the royal toilet. The king was furious, but he couldn&apos;t seem to stop Jokester.
        </P>
        <P>
          And then, one day, the people of the kingdom discovered that the jokes left by Jokester were so funny that they couldn&apos;t help but laugh. And once they started laughing, they couldn&apos;t stop.
        </P>
      </div>

      <div>
        <H3>The People&apos;s Rebellion</H3>
        <P>
          The people of the kingdom, feeling uplifted by the laughter, started to tell jokes and puns again, and soon the entire kingdom was in on the joke.
        </P>
        
        <div className="my-6 w-full overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <th className="border px-4 py-2 text-left font-bold">King&apos;s Treasury</th>
                <th className="border px-4 py-2 text-left font-bold">People&apos;s happiness</th>
              </tr>
            </thead>
            <tbody>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <td className="border px-4 py-2 text-left">Empty</td>
                <td className="border px-4 py-2 text-left">Overflowing</td>
              </tr>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <td className="border px-4 py-2 text-left">Modest</td>
                <td className="border px-4 py-2 text-left">Satisfied</td>
              </tr>
              <tr className="m-0 border-t p-0 even:bg-muted">
                <td className="border px-4 py-2 text-left">Full</td>
                <td className="border px-4 py-2 text-left">Ecstatic</td>
              </tr>
            </tbody>
          </table>
        </div>

        <P>
          The king, seeing how much happier his subjects were, realized the error of his ways and repealed the joke tax. Jokester was declared a hero, and the kingdom lived happily ever after.
        </P>
        
        <div className="flex gap-8 items-center">
          <Large>The moral of the story is:</Large>
          <P>never underestimate the power of a good laugh.</P>
        </div>
        
        <div className="mt-6">
          <Small>Examples of typography components from </Small>
          <InlineCode>@/components/ui/typography</InlineCode>
          <Muted> - Based on shadcn/ui typography styles</Muted>
        </div>
      </div>
    </div>
  )
} 