<template>
  <div class="container px-4">
    <section class="hero">
      <div class="hero-body has-text-left">
        <p class="has-text-weight-bold has-text-dark">Bank A</p>
        <p class="title mb-2">
          Credit Application Details
        </p>
        <p class="has-text-weight-light has-text-grey ">
          Review the information submitted by the customer
        </p>
      </div>
      <div class="box-custom py-5 px-6 mx-3 has-text-left">
        <div class="columns mb-0">
          <div class="column is-2">
            <p>Application ID</p>
          </div>
          <div class="column">
            <p>{{ data.record_id }}</p>
          </div>
        </div>
        <div class="columns mb-0">
          <div class="column is-2">
            <p>Credit Type</p>
          </div>
          <div class="column">
            <p>{{ data.credit_type }}</p>
          </div>
        </div>
        <div class="columns mb-0">
          <div class="column is-2">
            <p>Amount</p>
          </div>
          <div class="column">
            <p>
              Rp. <span>{{ data.amount }}</span>
            </p>
          </div>
        </div>
        <div class="columns mb-4">
          <div class="column is-2">
            <p>Status</p>
          </div>
          <div class="column">
            <p>
              {{ data.status }}
            </p>
          </div>
        </div>
        <div class="columns mb-0 mt-2">
          <div class="column is-2">
            <p>Name</p>
          </div>
          <div class="column">
            <p>{{ profile.name }}</p>
          </div>
        </div>
        <div class="columns mb-0">
          <div class="column is-2">
            <p>NIK</p>
          </div>
          <div class="column">
            <p>{{ profile.nik }}</p>
          </div>
        </div>
        <div class="columns mb-0">
          <div class="column is-2">
            <p>Birthplace</p>
          </div>
          <div class="column">
            <p>{{ profile.birthplace }}</p>
          </div>
        </div>
        <div class="columns mb-0">
          <div class="column is-2">
            <p>Birthday</p>
          </div>
          <div class="column">
            <p>{{ profile.birthday }}</p>
          </div>
        </div>
        <div class="columns mb-0">
          <div class="column is-2">
            <p>Address</p>
          </div>
          <div class="column">
            <p>
              {{ profile.address }}
            </p>
          </div>
        </div>
        <div class="columns mb-0">
          <div class="column is-2">
            <p>ID Card</p>
          </div>
          <div class="column">
            <a @click="idCardOnClick">Download</a>
          </div>
        </div>
        <div class="columns mb-0">
          <div class="column is-2">
            <p>Bussiness License</p>
          </div>
          <div class="column">
            <a @click="blOnClick">Download</a>
          </div>
        </div>
        <div class="columns mt-5 pt-5">
          <div class="column"></div>
          <div class="column has-text-right">
            <button
              class="button is-danger  mx-2"
              @click="rejectOnClick"
              :class="{ 'is-loading': rejectLoadingState }"
            >
              Reject
            </button>
            <button
              class="button is-link mx-2"
              @click="approveOnClick"
              :class="{ 'is-loading': approveLoadingState }"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import axios from "axios";
import fileDownload from "js-file-download";
export default {
  data() {
    return {
      data: {},
      //   accessToken: "",
      profile: {},
      rejectLoadingState: false,
      approveLoadingState: false,
    };
  },
  async mounted() {
    console.log(this.$route.query.id);
    try {
      var response = await this.fetchRecordData();
      this.data = response.data;
      this.data.status =
        response.data.status.charAt(0).toUpperCase() +
        response.data.status.slice(1);
      console.log(this.data);
      var resRefresh = await this.refreshToken();
      //   console.log(resRefresh);
      var accessToken = resRefresh.data.accessToken;
      console.log(accessToken);
      var authToken = "Bearer " + accessToken;
      var resProfile = await axios.get(
        "https://api.catena.id/v1/fabric/users/bank/get",
        {
          headers: {
            Authorization: authToken,
          },
          params: {
            user_uid: this.data.user_uid,
          },
        }
      );
      this.profile = resProfile.data;
      var splittedTtl = resProfile.data.ttl.split(", ");
      this.profile.birthplace = splittedTtl[0];
      this.profile.birthday = splittedTtl[1];

      this.profile.name =
        this.profile.first_name + " " + this.profile.last_name;

      this.profile.address =
        this.profile.address_line_1 +
        ", " +
        this.profile.address_line_2 +
        ", " +
        this.profile.city +
        ", " +
        this.profile.province +
        ", Indonesia. " +
        this.profile.postal_code;
      console.log(this.profile);
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    idCardOnClick() {
      var fileName = Date.now();
      var cid = this.profile.idcard.split(".%.")[1];
      var ext = this.profile.idcard.split(".%.")[0].split(".")[1];
      this.downloadFile(cid, fileName + "." + ext);
      //   console.log(cid);
      //   console.log(ext);
    },
    blOnClick() {
      var fileName = Date.now();
      var cid = this.profile.business_license.split(".%.")[1];
      var ext = this.profile.business_license.split(".%.")[0].split(".")[1];
      this.downloadFile(cid, fileName + "." + ext);
      //   console.log(cid);
      //   console.log(ext);
    },
    async approveOnClick() {
      try {
        var params = new URLSearchParams();
        params.append("record_id", this.data.record_id);
        this.approveLoadingState = true;
        await axios.post(
          "https://api.catena.id/v1/fabric/credit/approve",
          params,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        var res = await this.fetchRecordData();
        this.approveLoadingState = false;
        this.data = res.data;
        this.data.status =
          res.data.status.charAt(0).toUpperCase() + res.data.status.slice(1);
      } catch (error) {
        console.log(error);
      }
    },
    async rejectOnClick() {
      try {
        var params = new URLSearchParams();
        params.append("record_id", this.data.record_id);
        this.rejectLoadingState = true;
        await axios.post(
          "https://api.catena.id/v1/fabric/credit/reject",
          params,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        var res = await this.fetchRecordData();
        this.rejectLoadingState = false;
        this.data = res.data;
        this.data.status =
          res.data.status.charAt(0).toUpperCase() + res.data.status.slice(1);
      } catch (error) {
        console.log(error);
      }
    },
    fetchRecordData() {
      return new Promise(async (resolve, reject) => {
        try {
          var res = await axios.get(
            "https://api.catena.id/v1/fabric/credit/get",
            {
              params: {
                record_id: this.$route.query.id,
              },
            }
          );

          resolve(res);
        } catch (error) {
          reject(error);
        }
      });
    },
    refreshToken() {
      return new Promise(async (resolve, reject) => {
        try {
          var res = await axios.get(
            "https://api.catena.id/backend/banka/refresh",
            {
              params: {
                email: this.data.email,
              },
            }
          );
          resolve(res);
        } catch (error) {
          reject(error);
        }
      });
    },
    downloadFile(cid, fileName) {
      //   console.log(cid);
      //   console.log(fileName);
      this.refreshToken()
        .then((token) => {
          var authToken = "Bearer " + token.data.accessToken;
          //   console.log(token);
          //   console.log(authToken);

          console.log("Downloading data");
          axios
            .get("https://api.catena.id/v1/ipfs/bank/fetch", {
              params: {
                cid: cid,
              },
              headers: {
                Authorization: authToken,
              },
              withCredentials: true,
              responseType: "blob",
            })
            .then((response) => {
              console.log("Data Downloaded");
              console.log(response);
              fileDownload(response.data, fileName);
            })
            .catch((err) => {
              this.isError = true;
              this.errorMessage = "Failed downloading " + fileName;
              console.log(err);
              console.log(this.errorMessage);
            });
        })
        .catch((err) => {
          this.isError = true;
          this.errorMessage = err;
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.box-custom {
  border: 0.12rem;
  border-style: solid;
  border-radius: 5px;
  border-color: whitesmoke;
}
</style>
