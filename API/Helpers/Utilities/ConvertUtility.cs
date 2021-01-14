using System;
using System.Globalization;

namespace API.Helpers.Utilities
{
    public static class ConvertUtility
    {
        /// <summary>
        /// Conver ép kiểu theo mẫu, Ví dụ input.ToString("dd/MM/yyyy");
        /// </summary>
        /// <param name="value"></param>
        /// <param name="tempFormat"></param>
        /// <returns></returns>
        public static string ToString(this object value, string tempFormat)
        {
            if (value == null)
            {
                return string.Empty;
            }

            return string.Format("{0:" + tempFormat + "}", value);

        }
        /// <summary>
        /// Chuyển value về dạng chuỗi.
        /// Trả về dạng chuỗi của value
        /// </summary>
        /// <param name="value">Giá trị cần chuyển đổi. </param>
        /// <returns>Trả về dạng chuỗi của value.</returns>
        public static string ToSafetyString(this object value)
        {
            if (value == null)
            {
                return string.Empty;
            }

            return value.ToString();

        }

        /// <summary>
        /// Chuyển value về dạng số nguyên(byte).
        /// Trả về dạng số nguyên(byte) của value
        /// </summary>
        /// <param name="value">Giá trị cần chuyển đổi. </param>
        /// <returns>Trả về dạng số nguyên (byte) của value.</returns>
        public static byte ToByte(this object value)
        {
            if (value == null)
                return 0;
            //Khai báo giá trị chứa kết quả mặ định, mặc định là 0
            byte result = 0;

            //Thử ép value thành kiểu byte
            byte.TryParse(value.ToString(), out result);

            //Trả về kết quả đã ép kiểu
            return result;
        }

        /// <summary>
        /// Chuyển value về dạng số nguyên(SByte).
        /// Trả về dạng số nguyên(SByte) của value
        /// </summary>
        /// <param name="value">Giá trị cần chuyển đổi. </param>
        /// <returns>Trả về dạng số nguyên (SByte) của value.</returns>
        public static SByte ToSByte(this object value)
        {
            if (value == null || value.ToString() == string.Empty)
                return 0;
            sbyte result = 0;
            sbyte.TryParse(value.ToString(), out result);
            return result;
        }

        /// <summary>
        /// Chuyển value về dạng số nguyên(Short).
        /// Trả về dạng số nguyên(Short) của value
        /// </summary>
        /// <param name="value">Giá trị cần chuyển đổi. </param>
        /// <returns>Trả về dạng số nguyên (Short) của value.</returns>
        public static short ToShort(this object value)
        {
            if (value == null || value.ToString() == string.Empty)
                return 0;
            short result = 0;
            short.TryParse(value.ToString(), out result);
            return result;
        }

        /// <summary>
        /// Chuyển value về dạng số nguyên(ToUInt).
        /// Trả về dạng số nguyên(ToUInt) của value
        /// </summary>
        /// <param name="value">Giá trị cần chuyển đổi. </param>
        /// <returns>Trả về dạng số nguyên (ToUInt) của value.</returns>
        public static uint ToUInt(this object value)
        {
            if (value == null || value.ToString() == string.Empty)
                return 0;

            ushort result = 0;

            ushort.TryParse(value.ToString(), out result);

            return result;
        }

        /// <summary>
        /// Chuyển value về dạng số nguyên(Ushort).
        /// Trả về dạng số nguyên(Ushort) của value
        /// </summary>
        /// <param name="value">Giá trị cần chuyển đổi. </param>
        /// <returns>Trả về dạng số nguyên (Ushort) của value.</returns>
        public static ushort ToUShort(this object value)
        {
            if (value == null || value.ToString() == string.Empty)
                return 0;

            ushort result = 0;

            ushort.TryParse(value.ToString(), out result);

            return result;
        }

        /// <summary>
        /// Chuyển value về dạng số nguyên(int).
        /// Trả về dạng số nguyên(int) của value
        /// </summary>
        /// <param name="value">Giá trị cần chuyển đổi. </param>
        /// <returns>Trả về dạng số nguyên (int) của value.</returns>
        public static int ToInt(this object value)
        {
            if (value == null || value.ToString() == string.Empty)
                return 0;
            int result = 0;
            int.TryParse(value.ToString(), out result);
            return result;
        }

        /// <summary>
        /// Chuyển value về dạng số thực(Float).
        /// Trả về dạng số thực(Float) của value
        /// </summary>
        /// <param name="value">Giá trị cần chuyển đổi. </param>
        /// <returns>Trả về dạng số thực (Float) của value.</returns>
        public static float ToFloat(this object value)
        {
            if (value == null || value.ToString() == string.Empty)
                return 0;
            float result = 0;
            float.TryParse(value.ToString(), out result);
            return result;
        }

        /// <summary>
        /// Chuyển value về dạng số thực(Double).
        /// Trả về dạng số thực (Double) của value
        /// </summary>
        /// <param name="value">Giá trị cần chuyển đổi. </param>
        /// <returns>Trả về dạng số thực (double) của value.</returns>
        public static double ToDouble(this object value)
        {
            if (value == null || value.ToString() == string.Empty)

                return 0;

            double result = 0;

            double.TryParse(value.ToString(), out result);

            return result;
        }

        /// <summary>
        /// Chuyển value về dạng số thực(Long).
        /// Trả về dạng số thực (Long) của value
        /// </summary>
        /// <param name="value">Giá trị cần chuyển đổi. </param>
        /// <returns>Trả về dạng số thực (Long) của value.</returns>
        public static long ToLong(this object value)
        {
            if (value == null || value.ToString() == string.Empty)

                return 0;

            long result = 0;

            long.TryParse(value.ToString(), out result);

            return result;
        }

        /// <summary>
        /// Chuyển value về dạng số thực(Long).
        /// Trả về dạng số thực (Long) của value
        /// </summary>
        /// <param name="value">Giá trị cần chuyển đổi. </param>
        /// <returns>Trả về dạng số thực (Long) của value.</returns>
        public static ulong ToULong(this object value)
        {
            if (value == null || value.ToString() == string.Empty)

                return 0;

            ulong result = 0;

            ulong.TryParse(value.ToString(), out result);

            return result;
        }

        /// <summary>
        /// Chuyển value về dạng số thực(decimal).
        /// Trả về dạng số thực (decimal) của value
        /// </summary>
        /// <param name="value">Giá trị cần chuyển đổi. </param>
        /// <returns>Trả về dạng số thực (decimal) của value.</returns>
        public static decimal ToDecimal(this object value)
        {
            if (value == null || value.ToString() == string.Empty)
                return 0;

            decimal result = 0;

            decimal.TryParse(value.ToString(), out result);

            return result;
        }

        /// <summary>
        /// Chuyển value về dạng kí tự (char).
        /// Trả về dạng kí tự (char) của value
        /// </summary>
        /// <param name="value">Giá trị cần chuyển đổi. </param>
        /// <returns>Trả về dạng kí tự (char) của value.</returns>
        public static char ToChar(this object value)
        {
            //Tối ưu hơn phân cách khi dùng hàm ||
            if (value == null || value.ToString() == string.Empty || (value.ToString().Length > 1))
            {
                return ' ';
            }
            char result = ' ';
            char.TryParse(value.ToString(), out result);
            return result;
        }

        /// <summary>
        /// Chuyển value về dạng luận lý (bool).
        /// Trả về dạng luận lý (bool) của value
        /// </summary>
        /// <param name="value">Giá trị cần chuyển đổi. </param>
        /// <returns>Trả về dạng luận lý (bool) của value.</returns>
        public static bool ToBool(this object value)
        {
            if (value == null)
            {
                return false;
            }

            if (value.ToInt() == 1)
            {
                return true;
            }

            bool result = false;
            bool.TryParse(value.ToString(), out result);
            return result;
        }

        /// <summary>
        /// Chuyển value về dạng ngày giờ (DateTime).
        /// Trả về dạng ngày giờ (DateTime) của value
        /// </summary>
        /// <param name="value">Giá trị cần chuyển đổi. </param>
        /// <returns>Trả về dạng ngày giờ (DateTime) của value.</returns>
        public static DateTime ToDateTime(this object value)
        {
            if (value == null || value.ToString() == string.Empty || value.ToString() == " ")
                return DateTime.MinValue;

            DateTime result = DateTime.MinValue;

            string[] formats = {"d/M/yyyy", "dd/MM/yyyy", "d/M/yyyy HH:mm:ss", "d/M/yyyy HH:mm", "dd/MM/yyyy HH:mm", "HH:mm:ss", "HH:mm",
"d-M-yyyy", "dd-MM-yyyy", "d-M-yyyy HH:mm:ss", "d-M-yyyy HH:mm", "dd-MM-yyyy HH:mm", "HH:mm:ss", "HH:mm"};//HH phủ cả từ 1-24h còn hh chỉ phủ từ 1-12h

            string[] dateStrings = {"5/1/2009 6:32 PM", "05/01/2009 6:32:05 PM",
                              "5/1/2009 6:32:00", "05/01/2009 06:32",
                              "05/01/2009 06:32:00 PM", "05/01/2009 06:32:00"};
            DateTime.TryParseExact(value.ToString(), formats,
                                    //new CultureInfo("en-US"),//Lấy văn hóa của Mỹ
                                    CultureInfo.CurrentCulture,//Lấy văn hóa của máy tính đang dùng
                                    DateTimeStyles.None,
                                    out result);
            return result;

        }
    }
}