var express = require('express');
var router = express.Router();
var date=new Date();

//添加学生数据库连接
var mysql = require("mysql");
var connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'1',
  database:'studentsystem'
});
connection.connect();


/* GET home page. */
router.get('z', function(req, res, next) {
 connection.query("SELECT * FROM stu WHERE guide=?",function select(err,results,fields){
  if(err){
    throw err;
  }
  if(results){
      res.render('index', { title: 'StudentSystem',info:results });
  }
})
});
var user;
//登录界面
router.get("/",function(req,res,next){
   res.render("index",{title:"StudentSystem",tip:null})
})
router.post("/",function(req,res,next){
   var name = req.body.name;
   var password = req.body.password;
   connection.query("SELECT * FROM worker where username=?",[name],function(err,results,fields){
     if(err){
       throw err;
     }
     //这里也可以 if((typeof results[0]) =="undefined")
   if( results.length== 0){
      res.render('index',{title:"CustomerSystem",tip:"Username is not exists!"})
   }else if(results[0].password==password){
     user = name;
     //登录成功的情况下，判断用户类型
     if(results[0].mark == "1"){
       connection.query("SELECT * FROM stu WHERE guide=?",name,function select(err,rows,fields){
       if(err){
         throw err;
       }
       if(rows){
         info=rows;
       }else{
         info=null;
       }
       res.render("zshouye",{title:name,system:"CustomerSystem",info:info,tip:""})
     })
   } else if(results[0].mark == "2"){
     connection.query("SELECT * FROM stu WHERE state=0",function select(err,rows,fields){
     if(err){
       throw err;
     }
     if(rows){
       info=rows;
     }else{
       info=null;
     }
     res.render("zshouye2",{title:name,system:"AccountSystem",info:info,tip:null})
   })
   }
     //else  其他用户类型。

  } else {
     res.render('index',{title:"CustomerSystem",tip:"Password is wrong!"})
  }
   })
})

//注册跳转登录
router.get("/regis",function(req,res,next){
  res.render("regis",{tip:null})
})
router.post("/regis",function(req,res,next){
    //重名验证
    connection.query("SELECT * FROM worker WHERE username=?",req.body.name,function select(err,rows,fields){
      if(err){ throw err;}
      if(rows.length == 0){
        //注册到数据库
         var regisinfo = [req.body.name,req.body.password,req.body.mark];
         connection.query("INSERT INTO worker(username,password,mark) values(?,?,?)",regisinfo,function(err,result){
           if(err){
             console.log(" Regis wrong");
             res.render("regis",{tip:"Register is Failed!"});
           }else{
             res.render("regis",{tip:"Register is Success!"});
           }

         })
      } else {
         res.render("regis",{tip:"Username is exists!"});
      }
    });
})
//登录界面。
router.post("/log",function(req,res,next){
    res.render("index",{title:"StudentSystem",tip:null});
})
router.get("/log",function(req,res,next){
    res.render("index",{title:"StudentSystem",tip:null});
})

//following list
router.post("/followinglist",function(req,res,next){
    res.render("index",{title:"StudentSystem",tip:null});
})
router.get("/followinglist",function(req,res,next){
    connection.query("SELECT * FROM stu WHERE  state=?  and guide=? ",[0,user],function select(err ,rows,fields){
      if(err){throw err;}
      if(rows){
        followinglist = rows;
      }else{
        followinglist =null;
      }
    res.render("zshouye",{title:user,info:null,system:"CustomerSystem",following:rows,tip:""})
      }
)
})
//详细跟踪记录

router.post("",function(req,res,next){
    res.render("index",{title:"StudentSystem",tip:null});
})
router.get(/^\/(\d+?)/,function(req,res,next){
  console.log(req.params[0],"123456");
    connection.query("SELECT * FROM stu WHERE  id=? ",req.params[0],function select(err ,rows,fields){
      if(err){throw err;}
      if(rows){
      console.log(rows[0].records)
      var text = rows[0].records.split("#");
   if(rows[0].guide == user){

    res.render("modify",{title:user,info:rows[0],system:"CustomerSystem",text:text})
  }else{
    connection.query("SELECT * FROM stu WHERE guide=?",name,function select(err,rows,fields){
      if(err){
        throw err;
      }
      if(rows){
          res.render("zshouye",{title:user,info:null,system:"CustomerSystem",following:rows,tip:""})
      }
    });
  }
 }else{
     connection.query("SELECT * FROM stu WHERE guide=?",name,function select(err,rows,fields){
       if(err){throw err;}
       if(rows){
        res.render("zshouye",{title:user,info:rows,system:"CustomerSystem",following:null,tip:""})
       }
     });
 }
      }
)
})

//修改跟踪记录
router.post("/addrecord",function(req,res,next){
  req.body.record ;
   connection.query("SELECT * from stu where id=?",req.body.id,function(err,results,fields){
     var newrecord=results[0].records+("#"+req.body.record+"---["+new Date().toLocaleString()+"]");
      connection.query("UPDATE stu set records=?,lasttime=? where id=?",[newrecord,new Date().toLocaleString(),req.body.id],function(err,result){
        if(err){
          throw err;
          console.log("更新错误");
        }else{
          connection.query("SELECT * FROM stu where id=?",req.body.id,function(err,rows,fields){
            var text = rows[0].records.split("#");
              res.render("modify",{title:user,info:rows[0],system:"CustomerSystem",text:text});
          })
        }
      })
   })

});
//回到首页。
// router.post("/backshouye",function(req,res,next){
//     res.render("index",{title:"StudentSystem",tip:null});
// })
router.get("/backshouye",function(req,res,next){
  connection.query("SELECT * FROM stu WHERE guide=?",user,function select(err,rows,fields){
    if(err){throw err;}
    if(rows){
     res.render("zshouye",{title:user,info:rows,system:"CustomerSystem",following:null,tip:""})
    }
  });
})
//新建客户

router.post("/newresult",function(req,res,next){
  var newinfo=[req.body.name,req.body.major,req.body.tel,req.body.intention,user,req.body.record,new Date().toLocaleString(),0]
  connection.query("INSERT INTO stu(name,major,tel,intention,guide,records,lasttime,state)values(?,?,?,?,?,?,?,?)",newinfo,function(err,result){
    if(err){
      res.render("newcustomer",{title:user,system:"CustomerSystem",tip:"创建失败！"})

    }else{
      connection.query("SELECT * FROM stu WHERE guide=?",user,function select(err,rows,fields){
        if(err){throw err;}
        if(rows){
         res.render("zshouye",{title:user,info:rows,system:"CustomerSystem",following:null,tip:"创建成功！"})
        }
      });
    }

  })


})
router.get("/newcustomer",function(req,res,next){
     res.render("newcustomer",{title:user,system:"CustomerSystem",tip:null})
})

//  已经完成的。
router.get("/complete",function(req,res,next){
  connection.query("SELECT * FROM stu WHERE guide=? and state=?",[user,1],function select(err,rows,fields){
    if(err){throw err;}
    if(rows.length>0){
     res.render("zshouye",{title:user,info:null,system:"CustomerSystem",following:null,completes:rows});
   } else{
     res.render("zshouye",{title:user,info:null,system:"CustomerSystem",following:null,completes:null});
   }
  });
})

//财务操作
//办理缴费
router.post("/payresult",function(req,res,next){

   if(req.body.paytype =="1"){
     var reqinfo =[req.body.id,req.body.name,req.body.pay,req.body.remark,user];
     connection.query("INSERT INTO payment(id,name,tuition,elsefee,pic) values(?,?,?,?,?)",reqinfo,function(err,result){
       if(err){ throw err;}
     })
   } else if(req.body.paytype =="2"){
     var reqinfo =[req.body.id,req.body.name,req.body.pay,req.body.remark,user];
     connection.query("INSERT INTO payment(id,name,dormitory,elsefee,pic) values(?,?,?,?,?)",reqinfo,function(err,result){
       if(err){ throw err;    }
     })
   }else{
     var pay=req.body.pay + req.body.mark;
     var reqinfo =[req.body.id,req.body.name,pay,user];
     connection.query("INSERT INTO payment(id,name,elsefee,pic) values(?,?,?,?)",reqinfo,function(err,result){
       if(err){ throw err;    }
     })
   }
   connection.query("UPDATE stu set state=1 where id=?",req.body.id,function(err,result){})
   connection.query("SELECT * FROM stu WHERE state=0",function select(err,rows,fields){
   if(err){
     throw err;
   }
   if(rows){
     info=rows;
   }else{
     info=null;
   }
   res.render("zshouye2",{title:user,system:"AccountSystem",info:info,tip:"缴费完成"})
 })
})

//查询界面点击缴费
router.get(/^\/updatepay\/(\d+?)/,function(req,res,next){
    console.log(req.params[0]);
    connection.query("SELECT * FROM stu where id=?",req.params[0],function(err,result,fields){
      res.render("updatepay",{title:"StudentSystem",tip:null,name:result[0].name,id:result[0].id});
    })
})
// 更新缴费
router.post("/updatepay",function(req,res,next){

     var reqinfo =[req.body.id,req.body.pay,req.body.remark];

     connection.query("SELECT * FROM payment where id=?",req.body.id,function(err,result,fields){

        if(req.body.paytype =="1"){
          paytype = "tuition";

          connection.query("UPDATE  payment set tuition=? where id=?",[req.body.pay+"+"+result[0].tuition,req.body.id],function(err,result){
            if(err){ throw err;}
          })
        }else if(req.body.paytype=="2"){
           paytype = "dormitory";
           before=
           connection.query("UPDATE payment set dormitory=? where id=?",[req.body.pay+"+"+result[0].dormitory,req.body.id],function(err,result){
             if(err){ throw err;}
           })
        }else{  paytype = "elsefee";
        connection.query("UPDATE payment set elsefee=? where id=?",[req.body.pay+"+"+result[0].elsefee,req.body.id],function(err,result){
          if(err){ throw err;}
        })
        }
     })


   connection.query("SELECT * FROM stu WHERE state=0",function select(err,rows,fields){
   if(err){
     throw err;
   }
   if(rows){
     info=rows;
   }else{
     info=null;
   }
   res.render("zshouye2",{title:user,system:"AccountSystem",info:info,tip:"缴费完成"})
 })
})

// 点击条目缴费
router.get(/^\/pay\/(\d+?)/,function(req,res,next){
    console.log(req.params[0]);
    connection.query("SELECT * FROM stu where id=?",req.params[0],function(err,result,fields){
      res.render("payment",{title:"StudentSystem",tip:null,name:result[0].name,id:result[0].id});
    })
})
// 输入内容缴费
router.get("/pay",function(req,res,next){
    res.render("payment",{title:"StudentSystem",tip:null,name:"",id:""});
})
//查询
router.get("/select",function(req,res,next){
  connection.query("SELECT * FROM payment",function select(err,rows,fields){
  if(err){
    throw err;
  }
  if(rows){
    info=rows;
  }else{
    info=null;
  }
  res.render("zshouye2",{title:user,system:"AccountSystem",selectresult:info,tip:null,info:null})
})

})

// 缴费界面返回
router.get("/backpay",function(req,res,next){
  connection.query("SELECT * FROM stu WHERE state=0",function select(err,rows,fields){
  if(err){
    throw err;
  }
  if(rows){
    info=rows;
  }else{
    info=null;
  }
  res.render("zshouye2",{title:user,system:"AccountSystem",info:info,tip:null})
})
})
//关闭数据库
// connection.end();
module.exports = router;
