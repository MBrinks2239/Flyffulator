<template>
  <div class="char">
    <h3>Your Character</h3>

    <div class="stats">
      <table class="stattable">
        <tbody>

          <tr>
            <td><h5>Class</h5></td>
            <td></td>
            <td>
              <select name="class" @change="ChangeJob()" id="job" v-model="$root.jobName">
                <option value="Vagrant">Vagrant</option>
                <option value="Assist">Assist</option>
                <option value="Billposter">Billposter</option>
                <option value="Ringmaster">Ringmaster</option>
                <option value="Acrobat">Acrobat</option>
                <option value="Jester">Jester</option>
                <option value="Ranger">Ranger</option>
                <option value="Magician">Magician</option>
                <option value="Psykeeper">Psykeeper</option>
                <option value="Elementor">Elementor</option>
                <option value="Mercenary">Mercenary</option>
                <option value="Blade">Blade</option>
                <option value="Knight">Knight</option>
              </select>
            </td>
          </tr>

          <tr>
            <td><h5>Level</h5></td>
            <td><h5>{{character.ref.level}}</h5></td>
            <td>
              <button class="btn-plus" @click="newlevel--">-</button>
              <input class="charinput" :class="{'red-text' : newlevel > this.maxLevel }" type="number" v-model="newlevel"/>
              <button class="btn-plus" @click="newlevel++">+</button>
            </td>
            <td>
              <button class="btn-plus" @click="newlevel = this.maxLevel">max</button>
            </td>
          </tr>

          <tr>
            <td><h5>STR</h5></td>
            <td><h5>{{character.ref.str}} <span class="added-stats">{{assignedStats.str}}</span></h5></td>
            <td>
              <button class="btn-plus" @click="addstr--">-</button>
              <input class="charinput" type="number" v-model="addstr"/>
              <button class="btn-plus" @click="addstr++">+</button>
            </td>
            <td>
              <button class="btn-plus" @click="addstr = statpoints">++</button>
            </td>
          </tr>

          <tr>
            <td><h5>STA</h5></td>
            <td><h5>{{character.ref.sta}} <span class="added-stats">{{assignedStats.sta}}</span></h5></td>
            <td>
              <button class="btn-plus" @click="addsta--">-</button>
              <input class="charinput" type="number" v-model="addsta"/>
              <button class="btn-plus" @click="addsta++">+</button>
            </td>
            <td>
              <button class="btn-plus" @click="addsta = statpoints">++</button>
            </td>
          </tr>

          <tr>
            <td><h5>DEX</h5></td>
            <td><h5>{{character.ref.dex}} <span class="added-stats">{{assignedStats.dex}}</span></h5></td>
            <td>
              <button class="btn-plus" @click="adddex--">-</button>
              <input class="charinput" type="number" v-model="adddex"/>
              <button class="btn-plus" @click="adddex++">+</button>
            </td>
            <td>
              <button class="btn-plus" @click="adddex = statpoints">++</button>
            </td>
          </tr>

          <tr>
            <td><h5>INT</h5></td>
            <td><h5>{{character.ref.int}} <span class="added-stats">{{assignedStats.int}}</span></h5></td>
            <td>
              <button class="btn-plus" @click="addint--">-</button>
              <input class="charinput" type="number" v-model="addint"/>
              <button class="btn-plus" @click="addint++">+</button>
            </td>
            <td>
              <button class="btn-plus" @click="addint = statpoints">++</button>
            </td>
          </tr>

          <tr>
            <td><h5>Assist/RM buffs</h5></td>
            <td></td>
            <td>
              <input id="buffs" type="checkbox" v-model="assistbuffs">
              <input class="charinput" type="number" v-model="assistint"/>
              int
            </td>
          </tr>

          <tr>
            <td><h5>Class buffs</h5></td>
            <td></td>
            <td>
              <input id="selfbuffs" type="checkbox" v-model="classbuffs">
            </td>
          </tr>

          <tr>
            <td><h5>Premium items</h5></td>
            <td></td>
            <td>
              <input id="premiumItems" type="checkbox" v-model="premiumItems">
            </td>
          </tr>

          <tr>
            <td><h5>Stat points</h5></td>
            <td></td>
            <td><h5 :class="{'red-text' : statpoints < 0 }">{{statpoints}}</h5></td>
          </tr>

        </tbody>
      </table>

      <button id="applystats" class="btn-plus" @click="ApplyStats">Apply</button>
      <button id="restatstats" class="btn-plus" @click="RestatCharacter">Re-Stat</button>
      <button id="resetstats" class="btn-plus" @click="ResetCharacter">Full Reset</button>


    </div>

  </div>
</template>

<script>
import { Vagrant } from '../../calc/jobs';
import { Utils } from '../../calc/utils';
export default {
  name: 'Character',
  data() {
    return {
      character: this.$root.character,
      newlevel: 0,
      addstr: 0,
      addsta: 0,
      adddex: 0,
      addint: 0,
      added: 0,
      assistbuffs: false,
      premiumItems: false,
      assistint: 300,
      classbuffs: false,
      statpoints: 0,
      totalstatpoints: 0,
      assignedStats: {str: 0, sta: 0, dex: 0, int: 0},
      maxLevel: Utils.maxLevel
    }
  },
  mounted() {
    this.statpoints = this.character.ref.level * 2 - 2;
  },
  created: function () {
    window.addEventListener('keypress', (e) => {
      if (e.code == 'Enter') {
        e.preventDefault();
        this.ApplyStats();
      }
    });
  },
  methods: {
    ChangeJob() {
      this.$root.updateJob();
      this.RestatCharacter();
    },
    ApplyStats() {
      if (this.addstr === "" || this.addsta === "" || this.adddex === "" || this.addint === "") {
        this.addstr = 0;
        this.adddex = 0;
        this.addsta = 0;
        this.addint = 0;
        return;
      }

      // Validate the character data
      if (this.statpoints < 0 || this.newlevel > Utils.maxLevel) {
        return;
      }
      
      this.character.ref.level = this.newlevel;

      this.character.ref.str += this.addstr;
      this.character.ref.sta += this.addsta;
      this.character.ref.dex += this.adddex;
      this.character.ref.int += this.addint;

      this.added += this.addstr + this.addsta + this.adddex + this.addint;
      Utils.addedStr += this.addstr;
      Utils.addedSta += this.addsta;
      Utils.addedDex += this.adddex;
      Utils.addedInt += this.addint;

      this.assignedStats = {str: Utils.addedStr, sta: Utils.addedSta, dex: Utils.addedDex, int: Utils.addedInt };

      this.addstr = 0;
      this.addsta = 0;
      this.adddex = 0;
      this.addint = 0;

      this.statpoints = this.character.ref.level * 2 - 2 - this.added;
      if (this.statpoints < 0) this.statpoints = 0;
      this.totalstatpoints = this.statpoints;

      this.character.ref.assistInt = this.assistint;
      this.character.ref.assistBuffs = this.assistbuffs;
      this.character.ref.selfBuffs = this.classbuffs;
      this.character.ref.premiumItems = this.premiumItems;
    },
    applyLoadedStats(appliedStats){      
      this.character.ref = new Vagrant();
      this.$root.jobName = appliedStats.jobName;
      this.$root.updateJob();
      this.newlevel = appliedStats.newlevel;
      this.added = appliedStats.addedStr + appliedStats.addedSta + appliedStats.addedDex + appliedStats.addedInt;
      Utils.addedStr = appliedStats.addedStr;
      Utils.addedSta = appliedStats.addedSta;
      Utils.addedDex = appliedStats.addedDex;
      Utils.addedInt = appliedStats.addedInt;
      this.character.ref.str = appliedStats.str;
      this.character.ref.sta = appliedStats.sta;
      this.character.ref.dex = appliedStats.dex;
      this.character.ref.int = appliedStats.int;
      this.assistint = appliedStats.assistint;
      this.assistbuffs = appliedStats.assistbuffs;
      this.premiumItems = appliedStats.premiumItems;
      this.classbuffs = appliedStats.classbuffs;
      this.addstr = 0;
      this.addsta = 0;
      this.adddex = 0;
      this.addint = 0;
      this.ApplyStats();
    },
    ResetCharacter() {
      this.character.ref = new Vagrant();
      this.$root.jobName = "Vagrant";
      this.newlevel = 1;
      this.addstr = 0;
      this.addsta = 0;
      this.adddex = 0;
      this.addint = 0;
      Utils.addedStr = 0;
      Utils.addedSta = 0;
      Utils.addedDex = 0;
      Utils.addedInt = 0;
      this.classbuffs = false;
      this.assistbuffs = false;
      this.premiumItems = false;
      this.assistint = 300;
      this.added = 0;

      this.ApplyStats();
    },
    RestatCharacter() {
      this.addstr = 0;
      this.addsta = 0;
      this.adddex = 0;
      this.addint = 0;
      this.added = 0;
      Utils.addedStr = 0;
      Utils.addedSta = 0;
      Utils.addedDex = 0;
      Utils.addedInt = 0;

      this.ApplyStats();
      this.character.ref.update();
    },
    UpdateStatPoints() {
      this.statpoints = this.totalstatpoints - this.addstr - this.addsta - this.adddex - this.addint;
    }
  },
  watch: {
    addstr() {
      this.UpdateStatPoints();
    },
    addsta() {
      this.UpdateStatPoints();
    },
    adddex() {
      this.UpdateStatPoints();
    },
    addint() {
      this.UpdateStatPoints();
    },
    assistint() {
      Utils.assistInt = this.assistint;
    },
    assistbuffs() {
      Utils.assistBuffs = this.assistbuffs;
    },
    premiumItems() {
      Utils.premiumItems = this.premiumItems;
    },
    classbuffs() {
      Utils.classBuffs = this.classbuffs;
    }
  }
}
</script>

<style scoped lang='scss'>
button#applystats, button#resetstats, button#restatstats {
  margin: 5px 15px 0px 15px;
}

.added-stats {
  font-style: italic;
  opacity: 0.5;
}

.red-text {
  color: #ff6961
}
</style>
