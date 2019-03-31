using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Proj_WeJob.Models.DAL
{
    public class Language
    {
        //properties      
        public string Name { get; set; }

        //constructor
        public Language(string Name)
        {          
            this.Name = Name;
        }

        public Language()
        {
        }

        // פונקציה שמחזירה רשימה של תחביבים 
        public List<Language> ReadLanguage()
        {
            DBservices dbs = new DBservices();
            return dbs.GetListLanguage("DBConnectionString");
        }
    }
}