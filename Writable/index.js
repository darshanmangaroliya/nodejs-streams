// const fs = require("node:fs/promises");

// // Execution Time:23.379s
// // CPU Usage: 100% (one core)
// // Memory Usage: 44MB
// (async () => {
//   console.time("writeMany");
//   const fileHandle = await fs.open("test.txt", "w");

//   for (let i = 0; i < 1000000; i++) {
//     await fileHandle.write(` ${i} `);
//   }
//   console.timeEnd("writeMany");
// })();

// Execution Time: 3.048s
// CPU Usage: 100% (one core)
// Memory Usage: 30MB
// const fs = require("node:fs");

// (async () => {
//   console.time("writeMany");
//   fs.open("test.txt", "w", (err, fd) => {
//     for (let i = 0; i < 1000000; i++) {
//       const buff = Buffer.from(` ${i} `, "utf-8");
//       fs.writeSync(fd, buff);
//     }

//     console.timeEnd("writeMany");
//   });
// })();

// const fs = require("node:fs/promises");

// DON'T DO IT THIS WAY!!!!
// Execution Time: 399.457ms
// CPU Usage: 100% (one core)
// Memory Usage: 200MB
// (async () => {
//   console.time("writeMany");
//   const fileHandle = await fs.open("test.txt", "w");

//   const stream = fileHandle.createWriteStream();

//   for (let i = 0; i < 1000000; i++) {
//     const buff = Buffer.from(` ${i} `, "utf-8");

//     // console.log(stream.writableBuffer);
//     // console.log(stream.writableHighWaterMark);
//     stream.write(buff);
//   }
//   console.timeEnd("writeMany");
// })();

const fs = require("fs/promises");

// // Execution Time: 2.7 s
// // Number of Writes: 1,000,000
// CPU Usage: 100% (one core)
// Memory Usage: 42MB
(async () => {
  console.time("writeMany");
  const fileHandle = await fs.open("test.txt", "w");

  const stream = fileHandle.createWriteStream();

  console.log(stream.writableHighWaterMark);

  //   8 bits = 1 byte
  //   1000 bytes = 1 kilobyte
  //   1000 kilobytes = 1 megabyte

  //   1a => 0001 1010

  //   const buff = Buffer.alloc(16383, "a");
  //   console.log(stream.write(buff));
  //   console.log(stream.write(Buffer.alloc(1, "a")));
  //   console.log(stream.write(Buffer.alloc(1, "a")));
  //   console.log(stream.write(Buffer.alloc(1, "a")));

  //   console.log(stream.writableLength);

  //   stream.on("drain", () => {
  //  create infinite loop
  //     console.log(stream.write(Buffer.alloc(16384, "a")));
  //     console.log(stream.writableLength);

  //     console.log("We are now safe to write more!");
  //   });

  let i = 0;

  const numberOfWrites = 1000000000;

  const writeMany = () => {
    while (i < numberOfWrites) {
      const buff = Buffer.from(` ${i} `, "utf-8");

      // this is our last write
      if (i === numberOfWrites - 1) return stream.end(buff);
      

      // if stream.write returns false, stop the loop
      if (!stream.write(buff)) break;

      i++;
    }
  };

  writeMany();

  // resume our loop once our stream's internal buffer is emptied
  stream.on("drain", () => {
    // console.log("Drained!!!");
    writeMany();
  });

  stream.on("finish", () => {
    console.timeEnd("writeMany");
    fileHandle.close();
  });
})();
