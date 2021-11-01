//templates section
let ImageLink=document.location.href.replace('index.html','img');
let jarTemplate= `<div class="container">
<div>
<h3>Добавить банки</h3>
<input type='text' placeholder='Название' v-model='JarName'> 
<input type='text' placeholder='Объем' v-model='JarWeigth'> 
<button @click='AddNewJar'> Добавить </button>
</div>
</div>
`;
let CookJamTemplate =`<div class="cookjam">
<div class="container">
<h3>Приготовить варенье</h3>
<div>
<select v-model='opt'>
<option>strawberry</option> 
<option>cherry</option> 
<option>apricot</option> 
</select>
<input type='text' textholder='cook' v-model='amount'>
<button @click.prevent='cookjam'>Приготовить</button>
</div>

<div>
<h3>Разлить по банкам</h3>
<select v-model='pour'>
<option>strawberry</option> 
<option>cherry</option> 
<option>apricot</option> 
</select>
<button @click=pourjam>разлить по банкам </button>
</div>
</div>
<div class='potwraper'>

<div class='potimg'>
<img src=${ImageLink}/pot.png class="pimg">
<img src=${ImageLink}/cherry.png class="potfr">
<span class="jamamount">{{JamTotal.cherry}}</span>

</div>
<div class='potimg'>
<img src=${ImageLink}/pot.png class="pimg">
<img src=${ImageLink}/apricot.png class="potfr">
<span class="jamamount">{{JamTotal.apricot}}</span>
</div>
<div class='potimg'>
<img src=${ImageLink}/pot.png class="pimg">
<img src=${ImageLink}/strawberry.png class="potfr">
<span class="jamamount">{{JamTotal.strawberry }} </span>
</div>


</div>
</div>
`

let JarShowTemplate= `
<div class="jarwrapper">
<div v-for="(jar,index) in jars" class="wraper"> 
<div class="jarimg">
<img src=${ImageLink}/jar.png class="jr">
<img :src=FrImg(jar.type) v-if="jar.type" class="frimg">
</div>
<span class="weigth">{{jar.left}}/{{jar.weigth}}</span>
<span class="weigth"><strong>{{index}}</strong></span>
</div>
</div>
`





//end of template section


const JarInput = {
    template: jarTemplate,
    data() {
        return {
            Jars: {
                
            },
            JarName: '',
            JarWeigth: 0,
            JarLeft:0,
            JamType: ''
        }
    },
    methods: {
        AddNewJar() {
            if(this.JarWeigth >= 100)
            {
            let Jar= new Object();
            Jar.weigth=Number(this.JarWeigth),
            Jar.left=Number(this.JarLeft),
            Jar.type=this.JamType,
            this.Jars[this.JarName]=Jar
            this.$emit('SentJars',this.Jars)
            this.JarName=''
            this.JarWeigth=0
            }
        },
               
    }

  }


  //second component
  const CookJam={
    template: CookJamTemplate,
    data(){
        return{
            opt: '',
            pour:'',
            amount: '0',
            JamTotal: {
                'strawberry':0,
                'cherry': 0,
                'apricot': 0
            }

        }
    },
    methods: {
        cookjam() {
            this.JamTotal[this.opt]+=Number(this.amount);
        },
        pourjam() {
            for(jar in this.jars){
                if(this.jars[`${jar}`]['left'] !== this.jars[`${jar}`]['weigth'] && (this.jars[`${jar}`]['type']==this.pour || this.jars[`${jar}`]['type']=='') && this.JamTotal[`${this.pour}`]!==0)
                {
                    if(this.JamTotal[`${this.pour}`] >(this.jars[`${jar}`]['weigth']-this.jars[`${jar}`]['left']))
                    {
                        let pouramount=this.jars[`${jar}`]['weigth']-this.jars[`${jar}`]['left'];
                        this.jars[`${jar}`]['left']+=pouramount;
                        this.JamTotal[`${this.pour}`]-=pouramount;
                        this.jars[`${jar}`]['type']=this.pour

                    }
                    else
                    {
                        this.jars[`${jar}`]['left']+=this.JamTotal[`${this.pour}`];
                        this.JamTotal[`${this.pour}`]-=this.JamTotal[`${this.pour}`];
                        this.jars[`${jar}`]['type']=this.pour

                    }
                    this.$emit('SentJars',this.jars)


                }

            }
        }
    },
    props: ['jars']
  }
  

  //third component
  const ShowJar={
      template:JarShowTemplate,
      props: ['jars'],
      methods:{
          FrImg(type){
              let root=document.location.href.replace('index.html','img/');
              let link=root+type+'.png';
              return link;
          }
      }

  }
  
  // Create Vue application
  const app = Vue.createApp({
    components: {
      JarInput, // Register a new component
      CookJam,
      ShowJar
    },
    name:'app',
    data() {
        return {
            Jars: {}
        }
    },
    methods: {
        SetJars(amount){
           this.Jars=amount
        }
        
    }
    
  })
  
  
  // Mount Vue application
  app.mount('#app')