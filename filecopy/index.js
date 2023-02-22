const { pipeline } = require("stream");
const fs = require("fs/promises");

// File Size Copied: 
// Memory Usage: 250mb file size
// Execution Time: 317.173 ms
// Maximum File Size Able to Copy: 2 GB
// (async () => {
//   console.time("copy");
//   const destFile = await fs.open("test-copy.txt", "w");
//   const result = await fs.readFile("test-big.txt");

//   await destFile.write(result);

//   console.timeEnd("copy");
//   destFile.close()
// })();

// File Size Copied: 4.5 GB
// Memory Usage: 25 MB
// Execution Time: 12 s
// Maximum File Size Able to Copy: No Limit
// (async () => {
//   console.time("copy");

//   const srcFile = await fs.open("test-large.txt", "r");
//   const destFile = await fs.open("text-copy.txt", "w");

//   let bytesRead = -1;

//   while (bytesRead !== 0) {
//     const readResult = await srcFile.read();
//     bytesRead = readResult.bytesRead;

//     if (bytesRead !== readResult.buffer.length) {
//       // we have some null bytes, remove them at the end of the returned buffer
//       // and then write to our file
//       const indexOfNotFilled = readResult.buffer.indexOf(0);
//       const newBuffer = Buffer.alloc(indexOfNotFilled);
//       readResult.buffer.copy(newBuffer, 0, 0, indexOfNotFilled);
//       destFile.write(newBuffer);
//     } else {
//       destFile.write(readResult.buffer);
//     }
//   }

//   console.timeEnd("copy");
// })();

// File Size Copied: 4.5 GB
// Memory Usage: 30 MB
// Execution Time: 9 s
// Maximum File Size Able to Copy: No Limit
(async () => {
  console.time("copy");

  const srcFile = await fs.open("test-large.txt", "r");
  const destFile = await fs.open("text-copy.txt", "w");

  const readStream = srcFile.createReadStream();
  const writeStream = destFile.createWriteStream();

  // console.log(readStream.readableFlowing);

  // readStream.pipe(writeStream);

  // console.log(readStream.readableFlowing);

  // readStream.unpipe(writeStream);

  // console.log(readStream.readableFlowing);

  // readStream.pipe(writeStream);

  // console.log(readStream.readableFlowing);

  // readStream.on("end", () => {
  //   console.timeEnd("copy");
  // });

  // Don't use pipe in production, use pipeline instead! It will automatically
  // handle the cleanings for you and give you an easy way for error handling
  pipeline(readStream, writeStream, (err) => {
    console.log(err);
    console.timeEnd("copy");
  });
})();