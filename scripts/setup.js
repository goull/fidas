var teams = teams_start;
var giornate = [day_1, day_2, day_3, day_4, day_5, day_6];
var chart = [];

var add = function (teams_array, team, key, value) {
  var i = teams_array.findIndex((t) => t.id == team);
  if (!(key in teams_array[i])) {
    teams_array[i][key] = 0;
  }
  teams_array[i][key] += value;
  return teams_array;
};

var app = new Vue({
  el: "#app",
  data: {
    teams: teams,
    giornate: giornate,
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
    sort: function (t) {
      t.sort((a, b) =>
        a.round_vinti > b.round_vinti
          ? -1
          : a.round_vinti < b.round_vinti
          ? 1
          : a.match_vinti > b.match_vinti
          ? -1
          : a.match_vinti < b.match_vinti
          ? 1
          : a.set_vinti - a.set_persi > b.set_vinti - b.set_persi
          ? -1
          : a.set_vinti - a.set_persi < b.set_vinti - b.set_persi
          ? 1
          : a.game_vinti - a.game_persi > b.game_vinti - b.game_persi
          ? -1
          : a.game_vinti - a.game_persi < b.game_vinti - b.game_persi
          ? 1
          : 0
      );
      return t;
    },

    compute: function (giorn, tea) {
      giorn.forEach((g, idx) => {
        if (g.round) {
          var res = g.round.reduce(
            (acc, r, idx) => {
              if (r.matches) {
                var res = r.matches.reduce(
                  (acc, m) => {
                    if (m.sets) {
                      var res = m.sets.reduce(
                        (acc, s, i) => {
                          if (s.length > 0) {
                            acc.games[0] =
                              acc.games[0] +
                              (i < 2
                                ? s[0]
                                : s.length > 0
                                ? s[0] > s[1]
                                  ? 7
                                  : 6
                                : 0);
                            acc.games[1] =
                              acc.games[1] +
                              (i < 2
                                ? s[1]
                                : s.length > 0
                                ? s[0] > s[1]
                                  ? 6
                                  : 7
                                : 0);
                            if (s[0] > s[1]) {
                              acc.sets[0]++;
                            }
                            if (s[0] < s[1]) {
                              acc.sets[1]++;
                            }
                          }
                          return acc;
                        },
                        { sets: [0, 0], games: [0, 0] }
                      );

                      tea = add(tea, m.teams[0].id, "game_vinti", res.games[0]);
                      tea = add(tea, m.teams[1].id, "game_vinti", res.games[1]);
                      tea = add(tea, m.teams[0].id, "set_vinti", res.sets[0]);
                      tea = add(tea, m.teams[1].id, "set_vinti", res.sets[1]);
                      tea = add(tea, m.teams[0].id, "game_persi", res.games[1]);
                      tea = add(tea, m.teams[1].id, "game_persi", res.games[0]);
                      tea = add(tea, m.teams[0].id, "set_persi", res.sets[1]);
                      tea = add(tea, m.teams[1].id, "set_persi", res.sets[0]);

                      m["result"] = [res.sets[0], res.sets[1]];
                      if (res.sets[0] > res.sets[1]) {
                        acc.matches[0]++;
                      }
                      if (res.sets[0] < res.sets[1]) {
                        acc.matches[1]++;
                      }
                      return acc;
                    }
                  },
                  { matches: [0, 0] }
                );

                tea = add(tea, r.teams[0], "match_vinti", res.matches[0]);
                tea = add(tea, r.teams[1], "match_vinti", res.matches[1]);
                tea = add(tea, r.teams[0], "match_persi", res.matches[1]);
                tea = add(tea, r.teams[1], "match_persi", res.matches[0]);

                r["result"] = [res.matches[0], res.matches[1]];

                if (res.matches[0] > res.matches[1]) {
                  tea = add(tea, r.teams[0], "round_vinti", 1);
                  tea = add(tea, r.teams[1], "round_persi", 1);
                }
                if (res.matches[0] < res.matches[1]) {
                  tea = add(tea, r.teams[1], "round_vinti", 1);
                  tea = add(tea, r.teams[0], "round_persi", 1);
                }
                return acc;
              }
            },
            { round: [0, 0] }
          );
        }
        chart[idx] = Array.from(this.sort(tea));
      });
      return { giorn, tea };
    },
    computeRound: function (round) {
      this.teams_round = this.teams_start;
      this.giornate_round = this.giornate.filter((g) => g.id == round);
      return this.compute(this.giornate_round, this.teams_round);
    },
  },
  beforeMount() {
    var result = this.compute(giornate, teams);
    this.giornate = result["giorn"];
    this.teams = result["tea"];

    this.teams = this.sort(this.teams);
  },
});
