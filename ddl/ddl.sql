-- drop table departments purge;
create table departments(
dept_id varchar2(50),
dept_name varchar2(200),
constraint departments_pk primary key (dept_id)
);

--drop table instructors purge;
create table instructors(
ins_id varchar2(50),
ins_name varchar2(200),
dept_id varchar2(50),
designation varchar2(100), 
profile_picture VARCHAR2(2000),
constraint instructor_pk primary key (ins_id),
constraint ins_dept_fk foreign key (dept_id) references departments
);

--drop table academic_term purge;
create table academic_term(
term_id varchar2(10) ,
lvl number(1),
trm number(1),
sssn varchar2(10),
constraint ac_pk primary key(term_id)
);

-- drop table students purge;
create table students(
student_id number,
student_name varchar2(200),
dept_id varchar2(50),
term_id varchar2(10),
ins_id varchar2(50), 
hall_name varchar2(100),
hall_status varchar2(50),
mobile_number number,
address varchar2(500), 
contact_person_name VARCHAR2(200) , 
contact_person_number NUMBER ,
psswrd varchar2(50),
profile_picture varchar2(1000),
constraint students_pk primary key (student_id),
constraint stu_dept_fk foreign key (dept_id) references departments ,
constraint term_id_fk foreign key (term_id) references academic_term ,
constraint adviser foreign key (ins_id) references instructors 
);

-- drop table courses;
create table courses(
course_id varchar2(6) ,
course_title varchar2(50),
credit_hour number(3),
dept_id varchar2(50) ,
available_dept varchar2(50) ,
constraint c_pk primary key(course_id),
constraint dept_fk foreign key(dept_id) references departments(dept_id) ,
constraint avl_dept_fk foreign key(available_dept) references departments(dept_id)
);

-- drop table courseinterm purge;
create table courseinterm(
course_id varchar2(6),
term_id varchar2(10) ,
constraint course_term_pk primary key(course_id,term_id),
constraint c_fk foreign key(course_id) references courses(course_id),
constraint trm_fk foreign key(term_id) references academic_term(term_id)
);

-- drop table registration purge;
create table registration(
student_id number,
course_id varchar2(6),
term_id varchar2(10),
approved_status number(1),
obtained_grade VARCHAR2(2),
constraint registration_pk primary key (student_id,course_id),
constraint std_fk foreign key(student_id) references students(student_id),
constraint course_fk foreign key(course_id) references courses(course_id),
constraint term_fk foreign key(term_id) references academic_term(term_id) 
);

