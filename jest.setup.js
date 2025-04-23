// Mock Next.js modules
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

// Mock environment variables
process.env.IMAGEKIT_PUBLIC_KEY = 'test-public-key';
process.env.IMAGEKIT_PRIVATE_KEY = 'test-private-key';
process.env.IMAGEKIT_URL_ENDPOINT = 'https://ik.imagekit.io/test';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';

// Mock global objects
global.File = class File {
  constructor(bits, name, options = {}) {
    this.bits = bits;
    this.name = name;
    this.type = options.type || '';
    this.size = bits.reduce((acc, bit) => acc + bit.length, 0);
  }

  arrayBuffer() {
    return Promise.resolve(Buffer.from(this.bits.join('')));
  }
};

global.Blob = class Blob {
  constructor(bits, options = {}) {
    this.bits = bits;
    this.type = options.type || '';
    this.size = bits.reduce((acc, bit) => acc + bit.length, 0);
  }
};

global.FormData = class FormData {
  constructor() {
    this.data = {};
  }

  append(key, value) {
    this.data[key] = value;
  }

  get(key) {
    return this.data[key];
  }
}; 