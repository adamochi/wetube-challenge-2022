import fs from "fs";

export const getTexts = async (req, res) => {
  await fs.readdir("upload/texts", "utf-8", (err, data) => {
    if (err) throw err;
    if (data) {
      return res.render("texts", { data });
    }
  });
};

export const postTexts = async (req, res) => {
  const { path } = req.file;
  await fs.readFile(path, "utf-8", (err, data) => {
    if (err) throw err;
    console.log(data);
    return res.redirect("/texts");
  });
};

export const getRead = async (req, res) => {
  const { id } = req.params;
  // console.log(id);
  const path = `upload/texts/${id}`;
  // console.log(path);
  await fs.readFile(path, (err, data) => {
    if (err) throw err;
    return res.render("read", { data });
  });
};

export const DeleteText = async (req, res) => {
  const { id } = req.params;
  const path = `upload/texts/${id}`;
  await fs.unlink(path, (err) => {
    if (err) throw err;
    console.log(id, "was deleted");
  });
  res.redirect("/texts");
};
