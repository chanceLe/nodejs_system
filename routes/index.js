var express = require('express');
var router = express.Router();


//添加学生数据库连接
var mysql = require("mysql");
var connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'1',
  database:'studentsystem'
});
connection.connect();

//增加
 function add(table,column,columns,arr){
   connection.query("SELECT"+column +"FROM"+table + where);
 }

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
      connection.query("SELECT * FROM stu WHERE guide=?",name,function select(err,rows,fields){
      if(err){
        throw err;
      }
      if(rows){
        info=rows;
      }else{
        info=null;
      }
      res.render("zshouye",{title:name,system:"CustomerSystem",info:info})
    })
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
     var regisinfo = [req.body.name,req.body.password,req.body.mark];
    connection.query("INSERT INTO worker(username,password,mark) values(?,?,?)",regisinfo,function(err,result){
      if(err){
        console.log(" Regis wrong");
        res.render("regis",{tip:"Register is Failed!"});
      }else{
        res.render("regis",{tip:"Register is Success!"});
      }

    })
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
    res.render("zshouye",{title:user,info:null,system:"CustomerSystem",following:rows})
      }
)
})
//修改跟踪记录

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
          res.render("zshouye",{title:user,info:null,system:"CustomerSystem",following:rows})
      }
    });
  }
 }else{
     connection.query("SELECT * FROM stu WHERE guide=?",name,function select(err,rows,fields){
       if(err){throw err;}
       if(rows){
        res.render("zshouye",{title:user,info:rows,system:"CustomerSystem",following:null})
       }
     });
 }
      }
)
})

//回到首页。
// router.post("/backshouye",function(req,res,next){
//     res.render("index",{title:"StudentSystem",tip:null});
// })
router.get("/backshouye",function(req,res,next){
  connection.query("SELECT * FROM stu WHERE guide=?",user,function select(err,rows,fields){
    if(err){throw err;}
    if(rows){
     res.render("zshouye",{title:user,info:rows,system:"CustomerSystem",following:null})
    }
  });
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
//关闭数据库
// connection.end();
module.exports = router;
