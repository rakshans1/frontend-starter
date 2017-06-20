import path from 'path';
import ejs from 'ejs';
import fs from 'fs';

module.exports = function(pathname) {
  const baseDir = path.join(__dirname, '../src/html/');
  const filename = path.parse(pathname).name;
  if (fs.existsSync(pathname)) {
    ejs.renderFile(pathname, (err, result) => {
      if (err) {
        console.log(err)
      } else {
        fs.writeFileSync(baseDir + filename + ".html", result);
      }
    });
    
  } else {
    return
  }
};