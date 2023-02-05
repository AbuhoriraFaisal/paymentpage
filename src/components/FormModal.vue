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
        <label for="firstname" class="label-title">Card Number <span style="color: red">*</span></label>
        <input type="text" id="firstname" class="form-input" placeholder="card number" maxlength="19" v-model="cardno" required name="card" />
    </div>
    <div class="form-group right">
        <label for="lastname" class="label-title">IBIN <span style="color: red">*</span></label>
        <input type="password" id="lastname" class="form-input" placeholder="card IBIN " required name="ibin" v-model="ibin"  maxlength="4" />
    </div>
</div>


<!-- Password and confirm password -->
<div class="horizontal-group">

  <div class="form-group left">
    <label for="month" class="label-title">Expiration Month <span style="color: red">*</span></label>
    <input type="text" id="month" class="form-input" placeholder="card expiration month" required v-model="month"  maxlength="2">
  </div>

  <div class="form-group right">
    <label for="year" class="label-title">Expiration Year <span style="color: red">*</span></label>
    <input type="text" class="form-input" id="year" placeholder="card expiration year" required  v-model="year" maxlength="4">
  </div>

</div>

</div>

<!-- form footer -->
<div class="form-footer">
  <span>* required</span>
  <button type="button"  @click="doPayment(cardno,month,year,ibin)"  class="btn">Confirm Payment</button>
</div>

</form>
</template>

<script>
import {v4 as uuidv4} from 'uuid';
export default ({
  data() {
        return {
            firstName: 'Maxnet',
            ages: [
                { no: 14 },
                { no: 144 },
                { no: 1455 }
            ],
            url: 'https://www.youtube.com/watch?v=CYPZBK8zUik&list=PL4cUxeGkcC9hYYGbV60Vq3IXYNfDk8At1&index=3',
            num1: 0,
            num2: 0,
            sum: 0,
            ibin: '',
            cardno: '',
            month: '',
            year: ''

        }
    },
    methods: {
      
        changeName(name) {
            this.firstName = name
        },
        addNumbers: function () {

            this.sum = parseInt(this.num1) + parseInt(this.num2) + 'memmememme'
        },
        async doPayment(cardno, month, year, ibin) {
            try {
                if(month>12 || month<1)
                {
                    alert("Invalid Month");
                    return false;
                }
                let currentYear = new Date().getFullYear()
                let maxYear = currentYear + 5 
                if(year > maxYear|| year < currentYear)
                {
                    alert("Invalid Year");
                    return false;
                }
                if(cardno.length !=16  && cardno.length !=19)
                {
                    alert("Invalid Card Number");
                    return false;
                }
                let expdate = month+''+year.substring(2,)
                let myuuid = uuidv4();
                console.log(myuuid)
                //         console.log(cardno + month + year+ibin)
                //     this.sum = cardno +''+ month+ ''+ year+''+ibin
                // let res = await axios.post('http://10.160.16.10:1447/max-pay/special-payment/do-payment',
                //     {
                //         tranDateTime: '240522090244',
                //         PAN: '9888190191237806',
                //         tranCurrency: 'SDG',
                //         tranAmount: 100,
                //         serviceProvider: '12',
                //         expDate: '2302',
                //         IPIN: '231323223132132132132132',
                //         UUID: '5465456545465456454654654'
                //     },
                // )
                // console.log(res)
                // fetch('http://10.160.16.10:1447/max-pay/special-payment/do-payment',
                 await fetch('https://eolrb8yfpiej1tg.m.pipedream.net/',
                    {
                        method: 'POST',

                        headers: {
                            'Content-Type': 'content/type'
                            // like application/json or text/xml
                        },
                        body: {
                            tranDateTime: '240522090244',
                            PAN: cardno,
                            tranCurrency: 'SDG',
                            tranAmount: 100,
                            serviceProvider: window.location.search.substring(1,),
                            expDate: expdate,
                            IPIN: ibin,
                            UUID: myuuid,
                        }
                    }
                )

                .then(response => response.json())
                .then(data => console.log(data))
                //  console.log(res)
                 console.log(window.location.search.substring(1,))
                 console.log(Date())
            }
            catch (error) {
              // error.value = "There was a problem adding post..."
                console.log(error)
            }
        }

    }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
@import url('httpss://fonts.googleapis.com/css?family=Roboto');

body {
  background:linear-gradient(to right, #b2cfda 0%, #d6dadb 50%, #b2cfda 99%);
  /* background:linear-gradient(to right, #78a7ba 0%, #385D6C 50%, #78a7ba 99%); */
}

.signup-form {
  font-family: "Roboto", sans-serif;
  width:950px;
  margin:30px auto;
  background:linear-gradient(to right, #ffffff 0%, #fafafa 50%, #ffffff 99%);
  border-radius: 10px;
}

.form-header  {
  background-color: #EFF0F1;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.form-header h1 {
  font-size: 30px;
  text-align:center;
  color:#666;
  padding:20px 0;
  border-bottom:1px solid #cccccc;
}
/*---------------------------------------*/
/* Form Body */
/*---------------------------------------*/
.form-body {
  padding:10px 40px;
  color:#666;
}

.form-group{
  margin-bottom:20px;
}

.form-body .label-title {
  color:#1BBA93;
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
    color: #333333;
    text-align: left;
    border: 1px solid #d6d6d6;
    border-radius: 4px;
    background: white;
    outline: none;
}



.horizontal-group .left{
  float:left;
  width:49%;
}

.horizontal-group .right{
  float:right;
  width:49%;
}

input[type="file"] {
 outline: none;
 cursor:pointer;
 font-size: 17px;
}

#range-label {
 width:15%;
 padding:5px;
 background-color: #1BBA93;
 color:white;
 border-radius: 5px;
 font-size: 17px;
 position: relative;
 top:-8px;
}


::-webkit-input-placeholder {
 color:#d9d9d9;
}

/*---------------------------------------*/
/* Form Footer */
/*---------------------------------------*/
.form-footer {
 clear:both;
}
/*---------------------------------------*/
/* Form Footer */
/*---------------------------------------*/
.signup-form .form-footer  {
  background-color: #EFF0F1;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  padding:10px 40px;
  text-align: right;
  border-top: 1px solid #cccccc;
}

.form-footer span {
  float:left;
  margin-top: 10px;
  color:#999;  
  font-style: italic;
  font-weight: thin;
}

.btn {
   display:inline-block;
   padding:10px 20px;
   background-color: #1BBA93;
   font-size:17px;
   border:none;
   border-radius:5px;
   color:#bcf5e7;
   cursor:pointer;
}

.btn:hover {
  background-color: #169c7b;
  color:white;
}
</style>
