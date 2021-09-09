var teams = teams_start;

var app = new Vue({
  el: "#app",
  data: {
    teams: teams,
    day: {
      round: [
        {
          teams: [],
          matches: [
            {
              teams: [
                {
                  players: [],
                },
                {
                  players: [],
                },
              ],
              sets: [[], [], []],
            },
            {
              teams: [{ players: [] }, { players: [] }],
              sets: [[], [], []],
            },
            {
              teams: [{ players: [] }, { players: [] }],
              sets: [[], [], []],
            },
          ],
        },
        {
          teams: [],
          matches: [
            {
              teams: [{ players: [] }, { players: [] }],
              sets: [[], [], []],
            },
            {
              teams: [{ players: [] }, { players: [] }],
              sets: [[], [], []],
            },
            { teams: [{ players: [] }, { players: [] }], sets: [[], [], []] },
          ],
        },
      ],
    },
    states: [
      { id: 0, name: "TBP" },
      { id: 1, name: "Running" },
      { id: 2, name: "Ended" },
    ],
  },
  methods: {
    getTeam: function (id) {
      return this.teams.find((t) => {
        return t.id == id;
      });
    },
    getPlayer: function (team_id, player_id) {
      return this.teams
        .find((t) => {
          return t.id == team_id;
        })
        .lineup.find((p) => {
          return p.id == player_id;
        });
    },
    getPlayersByTeamAndLevel: function (team_id, level) {
      var p = this.getTeam(team_id);

      if (p == null) {
        return [];
      }
      return p.lineup.filter((p) => {
        return p.livello == level;
      });
    },
    updateTeam: function (round, team_pos) {
      this.day.round[round].matches.forEach((m) => {
        m.teams[team_pos].id = this.day.round[round].teams[team_pos];
        m.teams[team_pos].players = [];
        m.teams[team_pos].sets = [];
      });
    },
    setLivello: function (livello, round, match) {
      this.day.round[round].matches[match].livello =
        livello +
        (livello > 0 ? livello - 1 : 0) +
        "-" +
        (livello + (livello > 0 ? livello - 1 : 0) + 1);
      return this.day.round[round].matches[match].livello;
    },
    checkThirdSet: function (round, match) {
      var res = this.day.round[round].matches[match].sets.reduce(
        (acc, e, i) => {
          if (i < 2) {
            if (e[0] > e[1]) {
              acc[0]++;
            }
            if (e[1] > e[0]) {
              acc[1]++;
            }
          }
          return acc;
        },
        [0, 0]
      );
      return res[0] == res[1];
    },
  },
  beforeMount() {} /*
  filters: {
    pretty: function(value) {
      return JSON.stringify(JSON.parse(value), null, 2);
    }
  } */,
});
