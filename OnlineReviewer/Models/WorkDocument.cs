using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Word = Microsoft.Office.Interop.Word;

namespace OnlineReviewer.Models
{
    public static class WorkDocument
    {

        public static Word.Document OpenDoc(string pathFile, Word.Application wordapp, Word.Document worddocument)
        {
            wordapp.Visible = true;
            Object filename = pathFile;
            Object confirmConversions = true;
            Object readOnly = false;
            Object addToRecentFiles = true;
            Object passwordDocument = Type.Missing;
            Object passwordTemplate = Type.Missing;
            Object revert = false;
            Object writePasswordDocument = Type.Missing;
            Object writePasswordTemplate = Type.Missing;
            Object format = Type.Missing;
            Object encoding = Type.Missing;
            Object oVisible = Type.Missing;
            Object openConflictDocument = Type.Missing;
            Object openAndRepair = Type.Missing;
            Object documentDirection = Type.Missing;
            Object noEncodingDialog = false;
            Object xmlTransform = Type.Missing;
            worddocument = wordapp.Documents.Open(ref filename,
                ref confirmConversions, ref readOnly, ref addToRecentFiles,
                ref passwordDocument, ref passwordTemplate, ref revert,
                ref writePasswordDocument, ref writePasswordTemplate,
                ref format, ref encoding, ref oVisible, ref openAndRepair,
                ref documentDirection, ref noEncodingDialog, ref xmlTransform);
            return worddocument;
        }
        public static void CorrectDoc(Word.Document worddocument)
        {
            Object begin = 0;
            Object end = 5;
            Word.Range wordrange = worddocument.Range(ref begin, ref end);
            wordrange.Select();
            wordrange.Comments.Add(wordrange, "Комментарий оставлен");
        }
        public static void SaveDoc(Word.Application wordapp)
        {
            Object saveChanges = Word.WdSaveOptions.wdPromptToSaveChanges;
            Object originalFormat = Word.WdOriginalFormat.wdWordDocument;
            Object routeDocument = Type.Missing;
            wordapp.Quit(ref saveChanges,
                         ref originalFormat, ref routeDocument);
            wordapp = null;
        }
    }
}