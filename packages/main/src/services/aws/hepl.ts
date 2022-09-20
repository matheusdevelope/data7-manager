export const Help_Send_Files_S3 = {
  message: "Send_Files_S3 service is online!",
  available_endepoints: {
    send_file_s3: {
      method: "POST",
      details:
        "Send a directory path to make the files available in a public URL and send to whatsapp.",
      expected_body: {
        requester: "your_cnpj_cpf",
        phone: "66999999999",
        path_files: "C:\\your_path",
        files: [
          {
            name: "name-file.pdf",
            description_name: "Message before link file",
            description_after_link: "Message after link file",
            auto_format: true,
          },
        ],
        hash_size: 5,
        expiration: 5,
        header_message:
          "This allow to add a custom message on top of message generate with the descriptions and links in URI Encode format",
        footer_message:
          "This allow to add a custom message on bottom of message generate with the  descriptions and links in URI Encode format",
      },
      requisited_values: {
        requester: "your_cnpj_cpf",
        phone: "66999999999",
      },
      optional_properties: {
        path_files: {
          required: false,
          default_value: "",
          details:
            "Directory path of the files, you can configure a default path in the aplication, then you don't need to passa this propertie.",
        },
        hash_size: {
          required: false,
          default_value: 5,
          details:
            "when you not provide the size of hash, it takes the default value 5, thats make the name file unique.",
        },
        expiration: {
          required: false,
          default_value: 30,
          details:
            "This propertie set the value of days that file is available to download, after this time, we delete the file on cloud.",
          details2:
            "The expiration times its always multiple of 5. Example: your send 3, the expiration will be 5, another example: you send 27, the expiration will be 30. We always make a round of the sended value.",
        },
        header_message: {
          required: false,
          default_value: "",
          details:
            "to send line breaks in the message you can type '\\n' or '[n]', then we convert to a line break. ",
        },
        footer_message: {
          required: false,
          default_value: "",
          details:
            "to send line breaks in the message you can type '\\n' or '[n]', then we convert to a line break. ",
        },
        files: {
          required: false,
          type: "array",
          default_value: [],
          details:
            "to send line breaks in the message you can type '\\n' or '[n]', then we convert to a line break. ",
          children: {
            description_name: {
              required: false,
              default_value: "",
              details:
                "to send line breaks in the message you can type '\\n' or '[n]', then we convert to a line break. ",
            },
            description_after_link: {
              required: false,
              default_value: "",
              details:
                "to send line breaks in the message you can type '\\n' or '[n]', then we convert to a line break. ",
            },
            auto_format: {
              required: false,
              default_value: true,
              details:
                "If set to FALSE, the description_name, link and description_after_link will be just concatenated, depending of your custom formatation.",
            },
          },
        },
      },
      return_values: {
        on_success: {
          message: "Success!",
          data: {
            files: [
              {
                name: "name_file.pdf",
                auto_format: true,
                description_name: "",
                description_after_link: "",
                url: "https://adress_server/name_file.pdf",
                expiration: 30,
              },
            ],
            message:
              "The Header message example 😎\n\nhttps://adress_server/name_file.pdf\n\nThe footer message example 😎",
            message_encoded_URI:
              "The%%20Header%%20message%%20example%%20%%F0%%9F%%98%%8E%%0A%%0Ahttps%%3A%%2F%%2Fadress_server%%2Fname_file.pdf%%0A%%0AThe%%20footer%%20message%%20example%%20%%F0%%9F%%98%%8E",
          },
          exceptions: "none",
          requester: "your_cnpj_cpf",
        },
        on_error: {
          message: "Error on make something",
          more: "Mode details of the error",
          error: [
            {
              message: "Message",
              error: {
                name: "Name Error",
                code: 550,
              },
            },
          ],
          common_errors: {
            550: "Requested action not taken. File unavailable (e.g., file not found, no access).",
          },
        },
      },
    },
  },
};
