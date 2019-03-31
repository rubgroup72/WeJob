using System.Collections.Generic;
using System.Web.Http;
using Proj_WeJob.Models.DAL;

namespace Proj_WeJob.Controllers
{
    public class LanguageController:ApiController
    {
        [HttpGet]
        [Route("api/Language")]
        public IEnumerable<Language> GET()
        {
            Language la = new Language();
            return la.ReadLanguage();
        }
    }
}