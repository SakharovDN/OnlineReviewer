using OnlineReviewer.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Word = Microsoft.Office.Interop.Word;

namespace OnlineReviewer.Controllers
{
    public class HomeController : Controller
    {
        private Word.Application app;

        private Word.Document doc;

        public ActionResult Index()
        {
            ViewBag.FileExists = false;
            return View();
        }

        [HttpPost]
        public ActionResult Index(HttpPostedFileBase file)
        {
            app = new Word.Application();
            if (file != null && file.ContentLength > 0)
                try
                {
                    string pathFile = Server.MapPath("~/App_Data/Uploads/") + file.FileName;
                    file.SaveAs(pathFile);
                    doc = WorkDocument.OpenDoc(pathFile, app);
                    WorkDocument.CorrectDoc(doc);
                    WorkDocument.SaveDoc(app);
                    ViewBag.Message = "Файл успешно загружен";
                    ViewBag.FileName = file.FileName;
                    ViewBag.FileExists = true;
                }
                catch (Exception ex)
                {
                    ViewBag.Message = "ERROR: " + ex.Message.ToString();
                    ViewBag.FileExists = false;
                }
            else
            {
                ViewBag.Message = "Файл не выбран";
                ViewBag.FileExists = false;
            }
            return View();
        }

        public FileResult DownloadFile(string fileName)
        {
            string pathFile = Server.MapPath("~/App_Data/Uploads/") + fileName;
            string contentType = "application/docx";
            string fileDownloadName = "reviewed" + fileName;
            return File(pathFile, contentType, fileDownloadName);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}