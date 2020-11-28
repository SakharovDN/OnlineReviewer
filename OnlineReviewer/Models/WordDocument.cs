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

            foreach(var wrongWord in dictionary)
            {
                //Весь контент документа присваивается области range
                Word.Range range = doc.Content;
                //Удаляем форматирование
                range.Find.ClearFormatting();
                //Поиск вперед по документу
                range.Find.Forward = true;
                //Текст, который ищется
                range.Find.Text = wrongWord.Key;
                //Выполнить поиск слова
                range.Find.Execute();
                //.Found возвращает true, если слово найдено
                while (range.Find.Found)
                {
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
    }
}