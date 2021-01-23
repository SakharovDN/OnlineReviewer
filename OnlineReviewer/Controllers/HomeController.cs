using OnlineReviewer.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Word = Microsoft.Office.Interop.Word;

namespace OnlineReviewer.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.FileExists = false;
            return View();
        }

        [HttpPost]
        public ActionResult Review(HttpPostedFileBase file)
        {
            Word.Application app = new Word.Application();
            Word.Document doc;
            try
            {
                WordDocument.DeleteOldDocuments();
                WordDocument.FileIsValid(file);
                //Загружаем файл на сервер
                string pathFile = Server.MapPath("~/App_Data/Uploads/") + file.FileName;
                WordDocument.Upload(file, pathFile);
                doc = WordDocument.Open(pathFile, app);
                WordDocument.Review(doc);
                WordDocument.Quit(app);

                //Объекты, которые передаются в Home/Index.cshtml
                //Сообщение об успешной загрузке и рецензировании документа
                ViewBag.Message = "Файл успешно загружен";
                //Имя файла документа, при нажатии на ссылку "Скачать файл" передается этот объект в метод DownloadFile
                ViewBag.FileName = file.FileName;
                //Рецензированный файл на сервере существует и рецензирован без ошибки
                ViewBag.FileExists = true;
                ViewBag.MistakesNumber = WordDocument.MistakesNumber;
            }
            catch(Exception ex)
            {
                //Объекты, которые передаются в Home/Index.cshtml
                //Сообщение об ошибке
                ViewBag.Message = ex.Message.ToString();
                //Рецензированный файл на сервере не существует или произошла ошибка при реценизровании
                ViewBag.FileExists = false;
            }
            return View("Index");
        }

        /// <summary>
        /// Метод отправляющий файл из сервера к клиенту
        /// </summary>
        /// <param name="fileName">Имя скачиваемого файла</param>
        /// <returns></returns>
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