﻿using Proj_WeJob.Models.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Proj_WeJob.Models
{
    public class Skill
    {
        //properties      
        public int SkillNo { get; set; }
        public string Name { get; set; }

        //constructor
        public Skill(int SkillNo,string Name)
        {
            this.SkillNo = SkillNo;
            this.Name = Name;
        }

        public Skill()
        {
        }

        // פונקציה שמחזירה רשימה של תחביבים 
        public List<Skill> ReadSkill()
        {
            DBservices dbs = new DBservices();
            return dbs.GetListSkill("DBConnectionString");
        }
    }
}