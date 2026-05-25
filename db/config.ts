import { defineDb, defineTable, column } from 'astro:db';

const Comment = defineTable({
  columns: {
    author: column.text(),
    body: column.text(),
  }
});

////// ELO for sanger
const Songs = defineTable({
  columns: {
    songID: column.number({ primaryKey: true }),
    artistName: column.text(),
    // artistID: column.number({ references: () => Artists.columns.artistID }),
    songName: column.text(),
    elo: column.number(),
    numMatches: column.number(),
  }
})

const Matches = defineTable({
  columns: {
    matchID: column.number({ primaryKey: true }),
    songID1: column.number({ references: () => Songs.columns.songID }),
    songID2: column.number({ references: () => Songs.columns.songID }),
    songIDwinner: column.number({ references: () => Songs.columns.songID }),
  }
})





// https://astro.build/db/config
export default defineDb({
  tables: {
    Comment, Songs, Matches
  }
});
