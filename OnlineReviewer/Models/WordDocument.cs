using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Hosting;
using Word = Microsoft.Office.Interop.Word;

namespace OnlineReviewer.Models
{
    public static class WordDocument
    {
        public static int MistakesNumber;

        /// <summary>
        /// Открывает и возвращает документ Word
        /// </summary>
        /// <param name="pathFile">Путь до файла</param>
        /// <param name="app"></param>
        /// <returns></returns>
        public static Word.Document Open(string pathFile, Word.Application app)
        {
            app.Visible = false;
            Object fileName = pathFile;
            Word.Document doc = app.Documents.Open(ref fileName);
            return doc;
        }

        /// <summary>
        /// Метод, который ищет ошибки в документе
        /// </summary>
        /// <param name="doc">Документ, в котором ищутся ошибки</param>
        public static void Review(Word.Document doc)
        {
            var dictionary = InitializeDictionary();
            MistakesNumber = 0;
            foreach (var wrongWord in dictionary)
            {
                //Весь контент документа присваивается области range
                Word.Range range = doc.Content;
                //Удаляем форматирование
                range.Find.ClearFormatting();
                //Поиск вперед по документу
                range.Find.Forward = true;
                //Текст, который ищется
                range.Find.MatchWholeWord = true;
                range.Find.Text = wrongWord.Key;
                //Выполнить поиск слова
                range.Find.Execute();
                //.Found возвращает true, если слово найдено
                while (range.Find.Found)
                {
                    MistakesNumber++;
                    //Добавляется примечание
                    range.Comments.Add(range, wrongWord.Value);
                    //Поиск слова
                    range.Find.Execute();
                }
            }
        }
        /// <summary>
        /// Метод, который закрывает документ, сохраняя все изменения
        /// </summary>
        /// <param name="wordapp"></param>
        public static void Quit(Word.Application wordapp)
        {
            Object saveChanges = Word.WdSaveOptions.wdSaveChanges;
            Object originalFormat = Word.WdOriginalFormat.wdOriginalDocumentFormat;
            wordapp.Quit(ref saveChanges, ref originalFormat);
        }

        private static Dictionary<string,string> InitializeDictionary()
        {
            string dictionaryContent = File.ReadAllText(HostingEnvironment.MapPath("~/App_Data/dictionary.json"));
            Dictionary<string, string> dictionary = JsonConvert.DeserializeObject<Dictionary<string, string>>(dictionaryContent);
            return dictionary;
        }

        /// <summary>
        /// Метод, удаляющие файлы, которые были созданы больше 10 минут назад
        /// </summary>
        public static void DeleteOldDocuments()
        {
            var files = System.IO.Directory
                .GetFiles(AppDomain.CurrentDomain.BaseDirectory + @"\App_Data\Uploads", "*")
                .Where(file => file.ToLower().EndsWith("docx") || file.ToLower().EndsWith("doc"))
                .ToList();
            foreach (string file in files)
            {
                DateTime creation = System.IO.File.GetCreationTime(file);
                if (((TimeSpan)(DateTime.Now - creation)).TotalMinutes > 1)
                {
                    System.IO.File.Delete(file);
                }
            }
        }

        /// <summary>
        /// Метод, который проверяет файл на соответствие ограничениям (размер файла, расширение)
        /// </summary>
        /// <param name="file"></param>
        public static void FileIsValid(HttpPostedFileBase file)
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
                throw new ArgumentException("Файл должен быть меньше 10 Мб");
            }
        }

        public static void Upload(HttpPostedFileBase file, string pathFile)
        {
            file.SaveAs(pathFile);
        }
    }
}