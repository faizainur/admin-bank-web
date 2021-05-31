<template>
  <div class="container px-4">
    <section class="hero">
      <div class="hero-body has-text-left">
        <p class="has-text-weight-bold has-text-dark">Bank A</p>
        <p class="title mb-2">
          Credit Records
        </p>
        <p class="has-text-weight-light has-text-grey ">
          List of all submitted credit records
        </p>
      </div>
    </section>

    <div class="columns mb-0 mt-4">
      <div class="column is-four-fifths">
        <input
          type="text"
          class="input"
          placeholder="ex. Application ID, NIK, User UID"
          v-model="searchQuery"
        />
      </div>
      <div class="column">
        <button class="button is-fullwidth is-link" @click="searchOnClick">
          Search
        </button>
      </div>
    </div>

    <div class="control has-text-left mb-5">
      <label class="radio has-text-weight-light has-text-grey mr-3">
        <input type="radio" name="answer" v-model="selectedSearch" value="1" />
        Application ID
      </label>
      <label class="radio has-text-weight-light has-text-grey mr-3">
        <input type="radio" name="answer" v-model="selectedSearch" value="2" />
        NIK
      </label>
      <label class="radio has-text-weight-light has-text-grey mr-3">
        <input type="radio" name="answer" v-model="selectedSearch" value="3" />
        User UID
      </label>
      <label class="radio has-text-weight-light has-text-grey mr-3">
        <input type="radio" name="answer" v-model="selectedSearch" value="4" />
        None
      </label>
    </div>

    <table class="table is-fullwidth no-border mb-5">
      <thead class="thead-custom">
        <tr>
          <th
            class="has-text-weight-light has-text-grey is-size-7 start-thead-item"
          >
            APPLICATION ID
          </th>
          <th class="has-text-weight-light is-size-7 has-text-grey thead-item">
            NIK
          </th>
          <th class="has-text-weight-light is-size-7 has-text-grey thead-item">
            CREDIT TYPE
          </th>
          <th class="has-text-weight-light is-size-7 has-text-grey thead-item">
            AMOUNT
          </th>
          <th
            class="has-text-weight-light is-size-7 has-text-grey end-thead-item"
          >
            STATUS
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="has-text-grey tbody-item" v-for="item in list" :key="item">
          <td>
            <!-- <router-link to="/?id={{item.record_id}}"
              >{{ item.record_id }}
            </router-link>V -->
            <a :href="item.link">{{ item.record_id }}</a>
          </td>
          <td>{{ item.nik }}</td>
          <td>{{ item.credit_type }}</td>
          <td>Rp. {{ item.amount }}</td>
          <td>
            {{ item.status.charAt(0).toUpperCase() + item.status.slice(1) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      selectedSearch: "4",
      searchQuery: "",
      list: [],
    };
  },
  methods: {
    async searchOnClick() {
      console.log(this.selectedSearch);
      try {
        switch (this.selectedSearch) {
          case "1":
            var response = await axios.get(
              "https://api.catena.id/v1/fabric/credit/get",
              {
                params: {
                  record_id: this.searchQuery.trim(),
                },
              }
            );
            this.list = [];
            this.list[0] = response.data;
            this.list.forEach((item, idx, arr) => {
              item.link = "/banka/credit?id=" + item.record_id;
            });
            console.log(response.data);
            break;

          case "2":
            var response = await axios.get(
              "https://api.catena.id/v1/fabric/credit/searchByNik",
              {
                params: {
                  nik: this.searchQuery.trim(),
                },
              }
            );
            this.list = response.data;
            this.list.forEach((item, idx, arr) => {
              item.link = "/banka/credit?id=" + item.record_id;
            });
            console.log(response.data);
            break;
          case "3":
            var response = await axios.get(
              "https://api.catena.id/v1/fabric/credit/search",
              {
                params: {
                  user_uid: this.searchQuery.trim(),
                },
              }
            );
            this.list = response.data;
            this.list.forEach((item, idx, arr) => {
              item.link = "/banka/credit?id=" + item.record_id;
            });
            console.log(response.data);
            break;
          case "4":
            var response = await axios.get(
              "https://api.catena.id/v1/fabric/credit/list/bank",
              {
                params: {
                  name: "BankA",
                },
              }
            );
            this.list = response.data;
            this.list.forEach((item, idx, arr) => {
              item.link = "/banka/credit?id=" + item.record_id;
            });
            console.log(response.data);
            break;
          default:
            break;
        }
      } catch (error) {
        this.list = [];
        console.log(error);
      }
    },
  },
  async mounted() {
    // this.list = [
    //   {
    //     record_id: "8f4200ea-bcd3-4c7e-9ffa-63a830be02ba",
    //     user_uid: "5d316075-4104-4d4e-8101-8b9459a57ca7",
    //     nik: "351504089442309",
    //     credit_type: "KUR Kecil",
    //     bank_name: "BankA",
    //     amount: "12311231",
    //     status: "pending",
    //   },
    // ];

    try {
      var response = await axios.get(
        "https://api.catena.id/v1/fabric/credit/list/bank",
        {
          params: {
            name: "BankA",
          },
        }
      );
      this.list = response.data;
      this.list.forEach((item, idx, arr) => {
        item.link = "/banka/credit?id=" + item.record_id;
      });
      //   console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style scoped>
.thead-custom {
  background-color: whitesmoke;
  border: 0px;
}

.no-border {
  border: 0px;
  border-style: none;
}

.table th {
  border: 0px;
  padding: 1em;
}

.thead-item {
  border: 0px;
}

.tbody-item {
  font-size: 1em;
}

.end-thead-item {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

.start-thead-item {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}
</style>
