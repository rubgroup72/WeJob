using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using Proj_WeJob.Models;

namespace Proj_WeJob.Controllers
{
    public class SkillController:ApiController
    {
        [HttpGet]
        [Route("api/Skill")]
        public IEnumerable<Skill> GET()
        {
            Skill s = new Skill();
            return s.ReadSkill();
        }
    }
}