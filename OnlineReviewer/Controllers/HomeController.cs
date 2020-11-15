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
        private Word.Application wordApp;
        private Word.Document wordDoc;
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Index(HttpPostedFileBase file)
        {
            wordApp = new Word.Application();
            if (file != null && file.ContentLength > 0)
                try
                {
                    string path = Path.Combine(Server.MapPath("~/App_Data/Uploads"),
                                               Path.GetFileName(file.FileName));
                    file.SaveAs(path);
                    wordDoc = WorkDocument.OpenDoc(path, wordApp, wordDoc);
                    WorkDocument.CorrectDoc(wordDoc);
                    WorkDocument.SaveDoc(wordApp);
                    path = "~/App_Data/Uploads/" + file.FileName;
                    ViewBag.Message = "File uploaded successfully";
                    ViewBag.pathFile = path;
                }
                catch (Exception ex)
                {
                    ViewBag.Message = "ERROR:" + ex.Message.ToString();
                }
            else
            {
                ViewBag.Message = "You have not specified a file.";
            }
            return View();
        }

        public FileResult GetFile(string pathFile)
        {
            // Путь к файлу
            string file_path = Server.MapPath(pathFile);
            // Тип файла - content-type
            string file_type = "application/docx";
            // Имя файла - необязательно
            string file_name = "Checked.docx";
            return File(file_path, file_type, file_name);
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