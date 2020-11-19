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
    public static class WorkDocument
    {

        /// <summary>
        /// Открывает и возвращает документ Word
        /// </summary>
        /// <param name="pathFile">Путь до файла</param>
        /// <param name="app"></param>
        /// <returns></returns>
        public static Word.Document OpenDoc(string pathFile, Word.Application app)
        {
            app.Visible = true;
            Object fileName = pathFile;
            Word.Document doc = app.Documents.Open(ref fileName);
            return doc;
        }

        /// <summary>
        /// Метод, который ищет ошибки в документе
        /// </summary>
        /// <param name="doc">Документ, в котором ищутся ошибки</param>
        public static void CorrectDoc(Word.Document doc)
        {
            var dictionary = InitializeDictionary();

            //Проходимся циклом по всем словам в словаре
            foreach(var wrongWord in dictionary)
            {
                Object findText = wrongWord.Key;
                //Проходимся циклом по все параграфам в документе
                foreach (Word.Paragraph paragraph in doc.Paragraphs)
                {
                    //Заносим параграф в область range
                    Word.Range range = paragraph.Range;
                    //Выделяем range
                    range.Select();
                    //Если range является ячейкой в таблице, переходим к следующему параграфу
                    if (doc.ActiveWindow.Selection.get_Information(Word.WdInformation.wdEndOfRangeColumnNumber).ToString() != "-1")
                        continue;
                    //Если в range найдено слово, range переопределяется, как текст от конца найденного слова до конца параграфа
                    for (Object start = paragraph.Range.Start; ; start = range.End)
                    {
                        range = doc.Range(ref start, paragraph.Range.End);
                        range.Find.ClearFormatting();

                        if (range.Find.Execute(ref findText))
                        {
                            // выделяем найденной слово
                            range.Select();
                            // пишем примечание
                            range.Comments.Add(range, wrongWord.Value);
                        }
                        else
                            break;
                    }
                }
            }
        }

        /// <summary>
        /// Метод, который закрывает документ, сохраняя все изменения
        /// </summary>
        /// <param name="wordapp"></param>
        public static void SaveDoc(Word.Application wordapp)
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