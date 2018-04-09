//Initiallising node modules
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const http = require('http');
const sql = require("mssql");
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

let httpServer = http.createServer(app);

// app.get("/api/*",function (req, res) {
//
// });
//
// if(!app.get("/api/*") && !app.post("/api/*")){
//
// }


// Setting Base directory
app.use(bodyParser.json());
//CORS Middleware
app.use(function (req, res, next) {
    //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

//Setting up server
const server = httpServer.listen(process.env.PORT || 5000, function () {
    const port = server.address().port;
    console.log("App now running on port", port);
});

console.log("Hi");
//Initiallising connection string
const config = {
    user:  "sa",
    password: "joker",
    server: "localhost\\DINESHSERVER",
    database: "elect",
    options: {
        encrypt: true // Use this if you're on Windows Azure
    }
};

//Function to connect to database and execute query
const executeQuery = async function(res, query){
    try{
        new sql.ConnectionPool(config).connect().then(pool => {
            return pool.request().query(query)
        }).then(result => {
            let rows = result.recordset;
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(200).send(rows);
            sql.close();
        }).catch(err => {
            res.status(500).send({ message: `${err}`});
            sql.close();
        });
        //
        // let pool = await sql.connect(config);
        // let result1 = await pool.request()
        //     .query(query);
        // pool.close();
        // sql.close();
        // res.send(result1.recordset);
    }catch (e){
        console.log(e);
    }
};

//Change
app.post("/api/user", function(req , res){
    const query = "SELECT [uid]\n" +
        "      ,[username]\n" +
        "      ,[password]\n" +
        "      ,[question]\n" +
        "      ,[answer]\n" +
        "  FROM [elect].[dbo].[user_details] where username = '"+req.body.username+"'";
    executeQuery (res, query);
});

app.get("/api/department", function(req , res){
    const query = "SELECT [dep_id]\n" +
        "      ,[dep_name]\n" +
        "      ,[dep_shrt]\n" +
        "  FROM [elect].[dbo].[department]";
    executeQuery (res, query);
});
app.get("/api/timings", function(req , res){
    const query = "select t.sem,t.start_date,t.elect,t.end_date, dp.dep_name, dp.dep_id ,t.timing_id from elect.dbo.timing as t, elect.dbo.department as dp where dp.dep_id = t.dep_id";
    executeQuery (res, query);
});

app.post("/api/check_timing", function(req , res){
    const query = "select * from elect.dbo.timing WHERE sem='"+req.body.sem+"' and dep_id = '"+req.body.dep_id+"'";
    //const res1 = executeQuery_Check(res, query);
    console.log(query);
    executeQuery(res, query);

});
//Changes
app.post("/api/insert_timing", function(req , res){
    const query_insert = "insert into elect.dbo.timing (sem,dep_id,elect,start_date,end_date) values " +
        "('"+req.body.sem+"'," +
        "'"+req.body.dep_id+"'," +
        "'"+req.body.elect+"'," +
        "'"+req.body.start+"'," +
        "'"+req.body.end+"')";
    console.log(query_insert);
    executeQuery(res,query_insert)
});

app.put("/api/update_timing", function(req , res){
    const query_update = "update elect.dbo.timing set start_date = '"+req.body.start+"',end_date = '"+req.body.end+"' where sem = '"+req.body.sem+"' and dep_id = '"+req.body.dep_id+"'";
    console.log(query_update);
    executeQuery(res,query_update)

});
app.put("/api/update_timing", function(req , res){
    const query_update = "update elect.dbo.timing set start_date = '"+req.body.start+"',end_date = '"+req.body.end+"' where timing_id '"+req.body.timing_id+"'";
    console.log(query_update);
    executeQuery(res,query_update)

});
app.put("/api/timings_update", function(req , res){
    const timing_id = req.body.timing_id.join();
    const query_update = "update elect.dbo.timing set start_date = '"+req.body.start_date+"',end_date = '"+req.body.end_date+"' where timing_id in ("+timing_id+")";
    console.log(query_update);
    executeQuery(res,query_update)

});

app.post("/api/semester", function(req , res){
    const query = "SELECT [sem] FROM [elect].[dbo].[course] where dep_id = '"+req.body.dep_id+"'  group by sem";
    console.log(req.body);
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/section", function(req , res){
    const query = "SELECT s.sec from [elect].[dbo].[student] as s , [elect].[dbo].[user_details] as ud where s.uid = ud.uid and ud.dep_id = '"+req.body.depid+"' and s.sem = '"+req.body.sem+"' GROUP BY s.sec";
    executeQuery (res, query);
});
app.post("/api/student", function(req , res){
    const query = "SELECT s.uid,ud.username,s.stud_name, s.sem,s.sec from elect.dbo.student as s , elect.dbo.user_details as ud where s.uid = ud.uid and ud.dep_id = '"+req.body.depid+"' and s.sem = '"+req.body.sem+"' and s.sec = '"+req.body.sec+"' ORDER BY s.stud_name ASC ";
    console.log(query);
    executeQuery (res, query);
});

app.post("/api/user/uname", function(req , res){
    const query = "SELECT count(*) as cnt" +
        "  FROM [elect].[dbo].[user_details] where username ='"+ req.body.username+"' and password ='"+ req.body.password+"'";
    console.log(query);
    executeQuery (res, query);
});

app.post("/api/export", function(req , res){
    if (!req.body.course_id || req.body.course_id === '') {
        const query = " select u.username as \"Reg. No.\",sd.stud_name as \"Student name\",sd.sec as \"Section\",c.course_code as \"Course Code\",c.course_name as \"Course Name\",d.dep_name as Department,staff.staff_name as \"Staff Name\" \n" +
            " from \n" +
            "elect.dbo.[course_choose] as cc,\n" +
            "elect.dbo.department as d,\n" +
            "elect.dbo.course as c,\n" +
            "elect.dbo.staff_details as staff,\n" +
            "elect.dbo.user_details as u,\n" +
            "elect.dbo.student as sd\n" +
            "where \n" +
            "c.course_id = cc.course_id and \n" +
            "staff.staff_id = cc.staff_id and \n" +
            "d.dep_id = '" + req.body.dep_id + "' and \n" +
            "c.sem = '" + req.body.sem + "' and \n" +
            "u.username = cc.username and \n" +
            "sd.uid = u.uid";
        console.log(query);
        executeQuery(res, query);
    } else {
        //Need to Be Changed
        const query = "select u.username as \"Reg. No.\",sd.stud_name as \"Student name\",sd.sec as \"Section\",c.course_code as \"Course Code\",c.course_name as \"Course Name\",d.dep_name as Department,staff.staff_name as \"Staff Name\" \n" +
            " from \n" +
            "elect.dbo.[course_choose] as cc,\n" +
            "elect.dbo.department as d,\n" +
            "elect.dbo.course as c,\n" +
            "elect.dbo.staff_details as staff,\n" +
            "elect.dbo.user_details as u,\n" +
            "elect.dbo.student as sd\n" +
            "where \n" +
            "c.course_id = cc.course_id and \n" +
            "staff.staff_id = cc.staff_id and \n" +
            "c.course_id = cc.course_id and \n" +
            "cc.course_id = '"+ req.body.course_id +"' and\n" +
            "u.username = cc.username and \n" +
            "sd.uid = u.uid";
        console.log(query);
        executeQuery(res, query);
    }
});
app.post("/api/courses_list", function(req , res){
    const query = "select * from elect.dbo.course where dep_id ='"+ req.body.dep_id+"' and sem = '"+ req.body.sem+"' and elect_id ='"+ req.body.elect+"'";
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/CheckStudentWaiting", function(req , res){
    const query = "SELECT *\n" +
        "  FROM [elect].[dbo].[course] where min_lim <= (\n" +
        "\tselect count(*) from elect.dbo.course_choose where course_id = (\n" +
        "\t\tselect course_id from elect.dbo.course_choose where grp_name='"+ req.body.grp_name+"' AND username='"+ req.body.username+"') )\n" +
        "\t\tand course_id = (\n" +
        "\t\tselect course_id from elect.dbo.course_choose where grp_name='"+ req.body.grp_name+"' AND username='"+ req.body.username+"')";
    executeQuery (res, query);
});
app.get("/api/all_combinations", function(req , res){
    const query = "SELECT \n" +
        "cc.course_comb_id,cc.course_comb_name,cc.sem,c.course_name,c.course_code,dep.dep_name,dep.dep_id\n" +
        "from \n" +
        "elect.dbo.course_comb as cc, \n" +
        "elect.dbo.department as dep, \n" +
        "elect.dbo.course as c \n" +
        "where dep.dep_id = cc.dep_id and c.course_id = cc.course_id ORDER BY cc.course_comb_id";
    executeQuery (res, query);
});
app.post("/api/combinations", function(req , res){
    const query = "SELECT \n" +
        "cc.course_comb_id,cc.course_comb_name,cc.sem,c.course_name,c.course_code,dep.dep_name,dep.dep_id\n" +
        "from \n" +
        "elect.dbo.course_comb as cc, \n" +
        "elect.dbo.department as dep, \n" +
        "elect.dbo.course as c \n" +
        "where dep.dep_id = cc.dep_id and c.course_id = cc.course_id and cc.dep_id = " + req.body.department  +  "  ORDER BY cc.course_comb_id";
    console.log(query);
    executeQuery (res, query);
});

app.post("/api/timings_delete", function(req , res){
    const timing_id = req.body.timing_id.join();
    const query = "DELETE FROM [elect].[dbo].[timing] WHERE timing_id in (" + timing_id+")";
    console.log(query);
    executeQuery (res, query);
});
//Changes
app.post("/api/student_details", function(req , res){
    const query = "SELECT ud.uid,ud.username,ud.dep_id,s.s_id,s.sem,ud.password from elect.dbo.user_details as ud, elect.dbo.student as s where ud.username = '" + req.body.username+"' and s.uid = ud.uid";
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/dep_login", function(req , res){
    const query = "SELECT * from elect.dbo.user_details as ud where ud.username = '" + req.body.username+"' ";
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/student_elect_list", function(req , res){
    const query = "select grp_name \n" +
        "from elect.dbo.grp \n" +
        "where grp_name like '%" + req.body.type+"%' AND \n" +
        "course_id in ( SELECT course_id from elect.dbo.course where sem = '" + req.body.sem+"' ) and dep_id = '" + req.body.dep_id+"' group by grp_name";
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/course_to_load", function(req , res){
    const query = "SELECT * FROM elect.dbo.course WHERE course_id in (select course_id from elect.dbo.grp where dep_id = '"+ req.body.dep_id+"' and grp_name = '"+ req.body.grp_name+"') and dep_id = '"+ req.body.dep_id+"' and sem = '"+ req.body.sem+"' and elect_id = '"+ req.body.type+"'";
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/course_to_load_other", function(req , res){
    const query = "select * from elect.dbo.course where course_id in (select course_id from elect.dbo.course_comb where dep_id = '"+ req.body.dep_id+"'  and sem = '"+ req.body.sem+"' ) and elect_id = '"+ req.body.type+"' and dep_id != '"+ req.body.dep_id+"'";
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/course_enrolment_count", function(req , res) {
    const query = "select count(*) as count from elect.dbo.course_choose where course_id = '" + req.body.course_id + "'";
    console.log(query);
    executeQuery(res, query);
});


app.post("/api/everyThings_done", function(req , res){
    console.log(JSON.stringify(req.body));
    const values = [];
    let p_no = 0;
    for (const course_id in req.body.course_id){
        if (req.body.course_id.hasOwnProperty(course_id)) {
            p_no++;
            const course = req.body.course_id[course_id];
            if (req.body.username !=="" && course !=="" && req.body.type !=="" && req.body.grp_name !=="" && req.body.dep_id !=="" ) {
                values.push("('" + course + "'," +
                    "'" + req.body.username + "'," +
                    "'" + req.body.type + "'," +
                    "'" + req.body.grp_name + "'," +
                    "'" + p_no + "'," +
                    "GETDATE(),'" + req.body.dep_id + "','"+ req.body.staff_id +"')");
            }
        }
    }
    const vals = values.join();
    const query = "insert into elect.dbo.course_choose(course_id,username,elect_id,grp_name,p_no,date,dep_id,staff_id) values " + vals +"";
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/comb_delete", function(req , res){
    const comb_id = req.body.comb_id.join();
    const query = "DELETE FROM [elect].[dbo].[course_comb] WHERE course_comb_id in (" + comb_id+")";
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/enrolledForSameCourse", function(req , res){
    const query = "select count(*) as enrolls FROM [elect].[dbo].[course_choose] WHERE course_id = '" + req.body.course_id+"'";
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/deleteMinimum", function(req , res){
    const query = "delete FROM [elect].[dbo].[course_choose] WHERE choose_id = '" + req.body.choose_id+"'";
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/deleteMinimumWarning", function(req , res){
    const query = "delete FROM [elect].[dbo].[course_choose] WHERE grp_name = '" + req.body.grp_name+"' and username = '" + req.body.username+"'";
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/isEnrolled", function(req , res){
    const query = "select cc.choose_id,cc.staff_id,cc.username,c.course_name,c.course_code,c.min_lim,c.max_lim,cc.course_id " +
        "FROM [elect].[dbo].[course_choose] as cc," +
        "elect.dbo.course as c WHERE cc.username = '" + req.body.username+"' and c.course_id = cc.course_id";
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/enrolledForStaff", function(req , res){
    if(req.body.staff_id === null){
        req.body.staff_id = "";
    }
    const query = "select count(*) as Students from elect.dbo.course_choose WHERE staff_id = '" + req.body.staff_id+"' and course_id = '"+ req.body.course_id+"'";
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/departmentStudentCount", function(req , res){
    const query = "select count(ud.username) as students from elect.dbo.user_details as ud,elect.dbo.student as s where s.uid = ud.uid and s.sem = '"+ req.body.sem+"' and ud.dep_id = '"+ req.body.dep_id+"'";
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/departmentStudentCount", function(req , res){
    const query = "select count(ud.username) as students from elect.dbo.user_details as ud,elect.dbo.student as s where s.uid = ud.uid and s.sem = '"+ req.body.sem+"' and ud.dep_id = '"+ req.body.dep_id+"'";
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/departmentEnrolledCount", function(req , res){
    const query = "SELECT count(*) as enrolled\n" +
        "  FROM [elect].[dbo].[course_choose] \n" +
        "  where \n" +
        "  username in (select ud.username from elect.dbo.user_details as ud,elect.dbo.student as s where s.uid = ud.uid and s.sem = '"+ req.body.sem+"' and ud.dep_id = '"+ req.body.dep_id+"')";
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/whats_chosen", function(req , res){
    const query = "select grp_name from elect.dbo.course_choose where username = '"+req.body.username+"' group by grp_name";
    console.log(JSON.stringify(req.body));
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/minMaxCourse", function(req , res){
    const query = "select min_lim,max_lim,course_id,course_name,course_code from elect.dbo.course where course_id = '"+req.body.course_id+"'";
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/CourseDetails", function(req , res){
    const query = "select sa.min,sa.max,sd.staff_name,sd.staff_id,sd.dep_id from elect.dbo.staff_assign as sa, elect.dbo.staff_details as sd where sd.staff_id = sa.staff_id and course_id = '"+req.body.course_id+"'";
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/assignToStaff", function(req , res){
    console.log(JSON.stringify(req.body));
    const staffs_max = [];
    const len = req.body.staff_id.length;
    const div = req.body.max/len;
    for(let i=1;i<=len;i++){
        if (i!==len) {
            staffs_max.push(Math.ceil(div));
        } else {
            staffs_max.push(Math.floor(div));
        }
    }
    console.log(staffs_max);
    let values = "";
    let i = 0;
    for (const staff_id in req.body.staff_id){
        if (req.body.staff_id.hasOwnProperty(staff_id)) {
            const staff = req.body.staff_id[staff_id];
            if (req.body.course_id !=="" && staff !=="" && req.body.min !=="" && req.body.max !=="") {
                values = values + "insert into elect.dbo.staff_assign(course_id,staff_id,min,max) values ('" + req.body.course_id + "'," +
                    "'" + staff + "'," +
                    "'" + req.body.min + "'," +
                    "'" + staffs_max[i] + "'); \n";
            }
            i++;
        }
    }
    const query =  values ;
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/staffsAssigned", function(req , res){
    const query = "select sa.assign_id,sa.staff_id,sd.staff_name,c.course_name,c.course_code,sa.course_id,sa.min,sa.max from elect.dbo.staff_assign as sa, elect.dbo.course as c,elect.dbo.staff_details as sd where sa.staff_id = sd.staff_id and sd.dep_id = '"+req.body.dep_id+"' and c.course_id = sa.course_id";
    console.log(JSON.stringify(req.body));
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/add_staff", function(req , res){
    const query = "insert into elect.dbo.staff_details ([staff_name],[dep_id]) values ( '"+req.body.name+"',"+req.body.depart+")";
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/delete_staffAssign", function(req , res){
    console.log(req.body);
    const assign_id = req.body.assign_id.join();
    const query = "delete from elect.dbo.staff_assign where assign_id  in ("+assign_id+")";
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/delete_staff", function(req , res){
    console.log(req.body);
    const staff_id = req.body.staff_id.join();
    const query = "delete from elect.dbo.staff_details where staff_id  in ('"+staff_id+"')";
    console.log(query);
    executeQuery (res, query);
});
app.get("/api/staffs", function(req , res){
    const query = "select staff_id,staff_name,dep_id from elect.dbo.staff_details";
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/groupingsOfDep", function(req , res){
    const query = "select grp_name from elect.dbo.grp where dep_id = '"+req.body.dep_id+"' group by grp_name ";
    console.log(query);
    executeQuery (res, query);
});

app.post("/api/delete_grp", function(req , res){
    const grp_name = req.body.grp_name.join();
    const query = "delete from elect.dbo.grp where grp_name in ('"+grp_name+"') and dep_id = '"+req.body.dep_id+"'";
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/insert_group", function(req , res){
    console.log(JSON.stringify(req.body));
    let values = "";
    for (const course_id in req.body.check_course){
        if (req.body.check_course.hasOwnProperty(course_id)) {
            const staff = req.body.check_course[course_id];
            if (staff !=="" && req.body.dep_id !=="" && req.body.grp_name !=="") {
                values = values + "insert into elect.dbo.grp(grp_name,course_id,dep_id) values ('" + req.body.grp_name + "'," +
                    "'" + staff + "'," +
                    "'" + req.body.dep_id + "');\n";
            }
        }
    }
    const query = values;
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/coursesOfDep", function(req , res){
    const query = "select * from elect.dbo.course where dep_id = '"+req.body.dep_id+"'";
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/coursesOfDepSem", function(req , res){
    const query = "select * from elect.dbo.course where dep_id = '"+req.body.dep_id+"' and sem = '"+req.body.sem+"'";
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/staffsOfDep", function(req , res){
    const query = "select * from elect.dbo.staff_details where dep_id = '"+req.body.dep_id+"'";
    console.log(query);
    executeQuery (res, query);
});
app.put("/api/comb_update", function(req , res){

    console.log(req.body);
    const quer = [];
    for (const comb_id in req.body.comb_id){
        if (req.body.comb_id.hasOwnProperty(comb_id)) {
            const comb = req.body.comb_id[comb_id];
            const sem = req.body.sem[comb];
            if (comb !==""  && sem !=="" ) {
                quer.push("update elect.dbo.course_comb set sem ='" + sem + "' where course_comb_id = '" + comb + "' ; ");
            }
        }
    }

    const vals = quer.join().replace(",","\n");
    console.log(vals);
    executeQuery (res, vals);
});

app.post("/api/insert_combination", function(req , res){

    let values = "";

    for (const course_id in req.body.check_course){
        if (req.body.check_course.hasOwnProperty(course_id)) {
            for (const dep_id in req.body.check_depart){
                if (req.body.check_depart.hasOwnProperty(dep_id)) {
                    const dep = req.body.check_depart[dep_id];
                    const course = req.body.check_course[course_id];
                    const sem = req.body.sem_input[dep];
                    if (dep !=="" && course !=="" && sem !=="" && req.body.comb_name !=="") {
                        values = values + "insert into elect.dbo.course_comb(course_comb_name,course_id,dep_id,sem) values ('" + req.body.comb_name + "','" + course + "','" + dep + "','" + sem + "')";
                    }
                }
            }
        }
    }
    const query = values;
    console.log(query);
    executeQuery (res, query);
});


app.get("/api/DepartmentUsers", function(req , res){
    const query = "select ud.uid,ud.username,dp.dep_name,dp.dep_shrt,ud.question,ud.answer \n" +
        "from \n" +
        "user_details as ud,department as dp where uid not in (select uid from student) and dp.dep_id = ud.dep_id and ud.username != 'admin'";
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/AddDepartmentUsers", function(req , res){
    const query = "INSERT INTO [dbo].[user_details] ([username],[password],[dep_id]) " +
        "VALUES ('"+ req.body.username +"','"+ req.body.password +"',"+ req.body.dep_id +")";
    console.log(query);
    executeQuery (res, query);
});
app.post("/api/DeleteDepartmentUsers", function(req , res){
    const uids = req.body.uid.join();
    const query = "delete from [dbo].[user_details] where uid in ("+uids+")";
    console.log(query);
    executeQuery (res, query);
});

app.post("/api/CheckTiming", function(req , res){
    const query = "select * from dbo.timing where dep_id = '"+ req.body.dep_id +"' and sem = '"+ req.body.sem +"'";
    console.log(query);
    executeQuery (res, query);
});

//Update
app.post("/api/ForgotPassword", function(req , res){
    const query = "select count(*) as cnt from dbo.user_details where " +
        "username = '"+ req.body.username +"' and question = '"+ req.body.seQuest +"' and answer = '"+ req.body.answer +"'";
    console.log(query);
    executeQuery (res, query);
});

app.post("/api/resetPass", function(req , res){
    const query = "update dbo.user_details set password = '"+ req.body.password +"' where username = '"+ req.body.username +"'";
    console.log(query);
    executeQuery (res, query);
});

app.post("/api/setSecurity", function(req , res){
    const query = "update dbo.user_details set question = '"+ req.body.question +"', answer = '"+ req.body.answer +"' " +
        "where username = '"+ req.body.username +"'";
    console.log(query);
    executeQuery (res, query);
});

app.post("/api/chosenByStud", function(req , res){
    const query = "select cc.grp_name,co.course_code,co.course_name from elect.dbo.course_choose as cc,dbo.course as co where username = '"+req.body.username+"' and co.course_id = cc.course_id";
    console.log(JSON.stringify(req.body));
    console.log(query);
    executeQuery (res, query);
});

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});