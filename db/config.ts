// https://docs.turso.tech/introduction
//https://docs.astro.build/en/guides/astro-db/

import { defineDb, defineTable, column } from 'astro:db';

const Comment = defineTable({
  columns: {
    author: column.text(),
    body: column.text(),
  }
})

////// ELO for sanger
export const Songs = defineTable({
  columns: {
    songID: column.number({ primaryKey: true }),
    artistName: column.text(),
    songName: column.text(),
    elo: column.number(),
    numMatches: column.number(),
    qualified: column.boolean(),
    albumCoverLink: column.text(),
  }
})

export const Matches = defineTable({
  columns: {
    matchID: column.number({ primaryKey: true }),
    songID1: column.number({ references: () => Songs.columns.songID }),
    songID2: column.number({ references: () => Songs.columns.songID }),
    songIDwinner: column.number({ references: () => Songs.columns.songID }),
  }
})
//// ELO slutt


// https://astro.build/db/config
export default defineDb({
  tables: {
    Comment, Songs, Matches
  }
});
