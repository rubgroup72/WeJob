﻿using Proj_WeJob.Models.DAL;
using System;
using System.Collections.Generic;

using System.Web.Http;

namespace Proj_WeJob.Models
{
    public class SubCategoryController:ApiController
    {
        [HttpGet]
        [Route("api/SubCategory")]
        public List<SubCategory> GET(string CategoryNo)
        {
            SubCategory Ca = new SubCategory();
            return Ca.ReadSubCategories(CategoryNo);
        }
        [HttpGet]
        [Route("api/SubCategorySearch")]
        public List<SubCategory> get(string Search, string CategoryNo)
        {
            SubCategory Ca = new SubCategory();
            return Ca.ReadSubCategoriesForSearch(Search,CategoryNo);
        }
    }
}