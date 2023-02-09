<template>
  <form class="signup-form">

    <!-- form header -->
    <div class="form-header">
      <h1>Online Payment</h1>
    </div>

    <!-- form body -->
    <div class="form-body">

      <!-- Firstname and Lastname -->
      <div class="horizontal-group">
        <div class="form-group left">
          <label for="cardno" class="label-title">Card Number <span style="color: red">*</span></label>
          <input type="text" id="cardno" class="form-input" v-on:keypress="isLetterOrNumber($event)" placeholder="card number" maxlength="19" v-model="cardno"
            required name="card" />
        </div>
        <div class="form-group right">
          <label for="ipin" class="label-title">IPIN <span style="color: red">*</span></label>
          <input type="password" id="ipin" v-on:keypress="isLetterOrNumber($event)" class="form-input" placeholder="card IPIN " required name="IPIN"
            v-model="IPIN" maxlength="4" />
        </div>
      </div>


      <!-- Password and confirm password -->
      <div class="horizontal-group">

        <div class="form-group left">
          <label for="month" class="label-title">Expiration Date <span style="color: red">*</span></label>
          <input type="date" id="month" class="form-input" placeholder="card expiration month" required v-model="date"
            maxlength="2">
        </div>

        <div class="form-group right">
          <!-- <label for="year" class="label-title">Expiration Year <span style="color: red">*</span></label>
          <input type="text" class="form-input" id="year" placeholder="card expiration year" required v-model="year"
            maxlength="4"> -->
          <label for="Amount" class="label-title">Amount In SDG <span style="color: red">*</span></label>
          <input type="text" id="Amount" class="form-input"  placeholder="amount" required v-model="Amount"
            maxlength="7">
        </div>

      </div>

    </div>

    <!-- form footer -->
    <div class="form-footer">
      <span>* required</span>
      <button type="button" @click="doPayment(cardno, date, IPIN, Amount)" class="btn">Confirm Payment</button>
    </div>

  </form>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { JSEncrypt } from "jsencrypt";


export default ({
  data() {
    return {
      sum: 0,
      IPIN: '',
      cardno: '',
      month: '',
      year: '',
      tranAmount: '',
      date: new Date()

    }
  },
  methods: {
    //
    isLetterOrNumber(e) {
            let char = String.fromCharCode(e.keyCode);
            if (/^[0-9]+$/.test(char)) return true;
            else e.preventDefault();
        },

    //
    changeName(name) {
      this.firstName = name
    },
    addNumbers: function () {

      this.sum = parseInt(this.num1) + parseInt(this.num2) + 'memmememme'
    },
    async doPayment(cardno, date, IPIN, Amount) {
      try {
        let dateArray = date.toString().split('-')
        console.log(date , "recived date");
        let month = dateArray[1]
        let eneteredYear = dateArray[0]
        let year = eneteredYear.substring(2,)
        let expdate = month + year
        console.log(expdate , "expdate")
        var currentDate = new Date();
        let currentYear = currentDate.getFullYear()
        let currentMonth = currentDate.getMonth()+1
        console.log(eneteredYear , "entered");
          console.log(currentYear, "real");
       
        if (eneteredYear < currentYear ) {
          alert("Invalid Date");
          return false;
        }
        if (month < currentMonth ) {
          alert("Invalid Date");
          return false;
        }
        if (cardno.length != 16 && cardno.length != 19) {
          alert("Invalid Card Number");
          return false;
        }
        var MyDateString;
        MyDateString = ('0' + currentDate.getDate()).slice(-2)
          + ('0' + (currentDate.getMonth() + 1)).slice(-2)
          + currentDate.getFullYear().toString().substring(2,) + currentDate.getHours() + currentDate.getMinutes() + currentDate.getSeconds();
         
        let serviceProviderId = window.location.search.substring(1,)
        let myuuid = uuidv4();
        // get public key from EBS
        let publicKeyRes = await axios.get('http://10.160.16.10:1447/max-pay/public-key/getKey',
          {
            tranDateTime: MyDateString,
            UUID: myuuid
          }, { headers: { userId: 12 } }
        )
        let ebsPublicKey = publicKeyRes.data.body
        console.log(ebsPublicKey);
        //do encryption with RSA for IPIN with the Public Key
        
        console.log(IPIN , "IPIN0");  
        IPIN = myuuid + IPIN
        // let key = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCgaYaBlc+yd+V4Cxt+jAHvKhzlmUk7klqEv2beiDj8B7JV0p54poRx8o66Ekl2r1+MgxIIp9vSVjBoWNEYlssyJaPliBaIGxFanPj00KSCBuX00egSBvKad6qkGrPdX7St/Gu/2qmLm2ycxv4mKH1BkPblXFkO+CxLuHRkEkpJqQIDAQAB"
        // key = ebsPublicKey
        var encrypt = new JSEncrypt();
        encrypt.setPublicKey(ebsPublicKey);
        let newIPIN = encrypt.encrypt(IPIN)
        console.log(newIPIN , "new");
        console.log(IPIN , "IPIN");
        console.log(myuuid);


        let res = await axios.post('http://10.160.16.10:1447/max-pay/special-payment/do-payment',
          {
            tranDateTime: MyDateString,
            PAN: cardno,
            tranCurrency: 'SDG',
            tranAmount: Amount,
            serviceProviderId: serviceProviderId,
            expDate: expdate,
            IPIN: newIPIN,
            UUID: myuuid
          }, { headers: { userId: 12 } }
        )
        console.log("Res: ", res)
        alert(res.data.body.responseMessage)
      }
      catch (error) {
        alert(error.message)
      }
    },
   
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #0e7ec0;
  margin-top: 60px;
}

@import url('httpss://fonts.googleapis.com/css?family=Roboto');

body {
  background: linear-gradient(to right, #0e7ec0 0%, #0e7ec0 50%, #0e7ec0 99%);
  /* background:linear-gradient(to right, #78a7ba 0%, #385D6C 50%, #78a7ba 99%); */
}

.signup-form {
  font-family: "Roboto", sans-serif;
  width: 650px;
  margin: 30px auto;
  background: linear-gradient(to right, #ffffff 0%, #fafafa 50%, #ffffff 99%);
  border-radius: 10px;
}

.form-header {
  background-color: #EFF0F1;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.form-header h1 {
  font-size: 30px;
  text-align: center;
  color: #eb6212;
  padding: 20px 0;
  border-bottom: 1px solid #cccccc;
}

/*---------------------------------------*/
/* Form Body */
/*---------------------------------------*/
.form-body {
  padding: 10px 40px;
  color: #eb6212;
}

.form-group {
  margin-bottom: 20px;
}

.form-body .label-title {
  color: #eb6212;
  font-size: 17px;
  font-weight: bold;
}

.form-body .form-input {
  font-size: 17px;
  box-sizing: border-box;
  width: 100%;
  height: 34px;
  padding-left: 10px;
  padding-right: 10px;
  color: #0e7ec0;
  text-align: left;
  border: 1px solid #d6d6d6;
  border-radius: 4px;
  background: white;
  outline: none;
}



.horizontal-group .left {
  float: left;
  width: 49%;
}

.horizontal-group .right {
  float: right;
  width: 49%;
}

input[type="file"] {
  outline: none;
  cursor: pointer;
  font-size: 17px;
}

#range-label {
  width: 15%;
  padding: 5px;
  background-color: #eb6212;
  color: white;
  border-radius: 5px;
  font-size: 17px;
  position: relative;
  top: -8px;
}


::-webkit-input-placeholder {
  color: #d9d9d9;
}

/*---------------------------------------*/
/* Form Footer */
/*---------------------------------------*/
.form-footer {
  clear: both;
}

/*---------------------------------------*/
/* Form Footer */
/*---------------------------------------*/
.signup-form .form-footer {
  background-color: #EFF0F1;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  padding: 10px 40px;
  text-align: right;
  border-top: 1px solid #cccccc;
}

.form-footer span {
  float: left;
  margin-top: 10px;
  color: #eb6212;
  font-style: italic;
  font-weight: thin;
}

.btn {
  display: inline-block;
  padding: 10px 20px;
  background-color: #eb6212;
  font-size: 17px;
  border: none;
  border-radius: 5px;
  color: #bcf5e7;
  cursor: pointer;
}

.btn:hover {
  background-color: #0e7ec0;
  color: white;
}
</style>
