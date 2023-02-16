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
          <input type="text" id="cardno" class="form-input" v-on:keypress="isLetterOrNumber($event)"
            placeholder="card number" maxlength="19" v-model="cardno" required name="card" />
        </div>
        <div class="form-group right">
          <label for="ipin" class="label-title">IPIN <span style="color: red">*</span></label>
          <input type="password" id="ipin" v-on:keypress="isLetterOrNumber($event)" class="form-input"
            placeholder="card IPIN " required name="IPIN" v-model="IPIN" maxlength="4" />
        </div>
      </div>
      <div>
      <DatePicker :disabled-dates="disabledDates"></DatePicker>
    </div>
      <!-- Password and confirm password -->
      <div class="horizontal-group">

        <div class="form-group left">
          <label for="month" class="label-title">Expiration Date <span style="color: red">*</span></label>
          <input type="date" id="month" class="form-input" placeholder="card expiration month" required v-model="date"
            maxlength="2">
            <v-date-picker v-model="date" min="2016-06-15"></v-date-picker>
        </div>

        <div class="form-group right">
          <!-- <label for="year" class="label-title">Expiration Year <span style="color: red">*</span></label>
          <input type="text" class="form-input" id="year" placeholder="card expiration year" required v-model="year"
            maxlength="4"> -->
          <label for="Amount" class="label-title">Amount In SDG <span style="color: red">*</span></label>
          <input type="text" id="Amount" class="form-input" placeholder="amount" required v-model="Amount"
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
import "../assets/style.css";

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
        let month = dateArray[1]
        let eneteredYear = dateArray[0]
        let year = eneteredYear.substring(2,)
        let expdate = +year + month
        console.log(expdate, "expdate")
        var currentDate = new Date();
        let currentYear = currentDate.getFullYear()
        let currentMonth = currentDate.getMonth() + 1

        if (eneteredYear < currentYear) {
          alert("Invalid Date");
          return false;
        }
        if (month < currentMonth) {
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
          + currentDate.getFullYear().toString().substring(2,)
          + ('0' + (currentDate.getHours())).slice(-2)
          + ('0' + (currentDate.getMinutes())).slice(-2)
          + ('0' + (currentDate.getSeconds())).slice(-2);

        console.log(MyDateString);
        let parms = window.location.search.substring(1,)
        let serviceProviderId  = parms.substring(0,parms.indexOf('/'))
        const ref = parms.substring(parms.indexOf('/')+1,parms.indexOf('/'))
        console.log(ref , "ref");
        let myuuid = uuidv4();
        // get public key from EBS
        let publicKeyRes = await axios.get('http://10.160.16.10:1447/max-pay/public-key/getKey',
          {
            tranDateTime: MyDateString,
            UUID: myuuid
          }, { headers: { userId: 12 } }
        )
        let ebsPublicKey = publicKeyRes.data.body

        //do encryption with RSA for IPIN with the Public Key
        IPIN = myuuid + IPIN
        var encrypt = new JSEncrypt();
        encrypt.setPublicKey(ebsPublicKey);
        let newIPIN = encrypt.encrypt(IPIN)


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

