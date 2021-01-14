
using System.Collections.Generic;

namespace API.Helpers.Utilities
{
     public class OperationResult
    {
        public string Caption { set; get; }
        public string Message { set; get; }
        public bool Success { set; get; }
        public object Data { set; get; }
        public List<string> ValidateData { set; get; }

        public OperationResult()
        {
            this.Data = null;
        }

        public OperationResult(string caption, string message, bool success)
        {
            this.Caption = caption;
            this.Message = message;
            this.Success = success;
        }

        public OperationResult(string message, bool success)
        {
            this.Message = message;
            this.Success = success;
        }

        public OperationResult(string caption, string message, bool success, object data)
        {
            this.Caption = caption;
            this.Message = message;
            this.Success = success;
            this.Data = data;
        }

        public OperationResult(string caption, string message, bool success, List<string> validateData)
        {
            this.Caption = caption;
            this.Message = message;
            this.Success = success;
            this.ValidateData = validateData;
        }
    }
}