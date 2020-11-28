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
                FileIsValid(file);
                //Загружаем файл на сервер
                string pathFile = Server.MapPath("~/App_Data/Uploads/") + file.FileName;
                file.SaveAs(pathFile);
                
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
        /// <summary>
        /// Метод, который проверяет файл на соответствие ограничениям (размер файла, расширение)
        /// </summary>
        /// <param name="file"></param>
        private void FileIsValid(HttpPostedFileBase file)
        {
            if (file == null || file.ContentLength == 0)
            {
                throw new ArgumentException("Файл не выбран");
            }
            string extension = Path.GetExtension(file.FileName);
            if (extension != ".docx" && extension != ".doc")
            {
                throw new ArgumentException("Расширение файла должно быть .docx или .doc");
            }
            if (file.ContentLength > 1e7)
            {
                throw new ArgumentException("Файл слишком большой");
            }
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