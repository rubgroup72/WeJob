using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Proj_WeJob.Models.DAL;

namespace Proj_WeJob.Models
{
    public class DataTrain
    { 
    
        public string Tag1 { get; set; }
        public string Tag2 { get; set; }
        public string Tag3 { get; set; }
        public string Tag4 { get; set; }
        public string Tag5 { get; set; }

        public DataTrain(string Tag1, string Tag2, string Tag3, string Tag4, string Tag5)
        {
            this.Tag1 = Tag1;
            this.Tag2 = Tag2;
            this.Tag3 = Tag3;
            this.Tag4 = Tag4;
            this.Tag5 = Tag5;
        }
        public DataTrain()
        {

        }


    }
}