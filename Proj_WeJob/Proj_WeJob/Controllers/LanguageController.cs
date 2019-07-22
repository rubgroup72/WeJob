using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Cors;
using Proj_WeJob.Models.DAL;

namespace Proj_WeJob.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class LanguageController:ApiController
    {
        [HttpGet]
        [Route("api/Language")]
        public IEnumerable<Language> GET()
        {
            Language la = new Language();
            return la.ReadLanguage();
        }
        [HttpGet]
        [Route("api/lang")]
        public IEnumerable<Language> Get(string StudentId)
        {
            Language l = new Language();
            return l.GetListLangByIdStudent(StudentId);
        }
    }
}