using System;
using System.Collections.Generic;

namespace API.Helpers.Utilities
{
    public static class FuncitonUtility
    {

        /// <summary>
        /// Chuyển value về dạng chuỗi.
        /// Trả về dạng chuỗi của value
        /// </summary>
        /// <param name="input">Giá trị cần chuyển đổi. </param>
        /// <returns>Trả về danh sách 12 tháng kể từ tháng hiện tại.</returns>
        public static List<string> GetLast12Month(string year,string month)
        {
            //Your code goes here
            DateTime date =new DateTime(year.ToInt(),month.ToInt(),1);
            List<string> listMonth = new List<string>();
            for (int i = 11; i >= 0; i--)
            {
                string monthLast = date.AddMonths(-i).ToString("yyyyMM");
                listMonth.Add(monthLast);
            }
            return listMonth;

        }

        
        /// <summary>
        /// Chuyển value về dạng chuỗi.
        /// Trả về dạng chuỗi của value
        /// </summary>
        /// <param name="input">Giá trị cần chuyển đổi. </param>
        /// <returns>Trả về danh sách 5 năm kể từ năm  hiện tại.</returns>
        public static List<string> GetLast5Year(string input)
        {
            //Your code goes here
           DateTime date =new DateTime(input.ToInt(),1,1);
            List<string> listYear = new List<string>();
            for (int i = 4; i >= 0; i--)
            {
                string lastYear = date.AddYears(-i).ToString("yyyy");
                listYear.Add(lastYear);
            }
            return listYear;
        }

         /// <summary>
        /// Chuyển value về dạng chuỗi.
        /// Trả về dạng chuỗi của value
        /// </summary>
        /// <param name="input">Giá trị cần chuyển đổi. </param>
        /// <returns>Trả về danh sách 24 tháng kể từ tháng hiện tại.</returns>
        public static List<string> GetLast24Month(string year,string month)
        {
            //Your code goes here
            DateTime date =new DateTime(year.ToInt(),month.ToInt(),1);
            List<string> listMonth = new List<string>();
            for (int i = 23; i >= 0; i--)
            {
                string monthLast = date.AddMonths(-i).ToString("yyyyMM");
                listMonth.Add(monthLast);
            }
            return listMonth;

        }
    }
}