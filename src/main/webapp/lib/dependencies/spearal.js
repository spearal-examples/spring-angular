var Spearal = function Spearal() {
  "use strict";
};
($traceurRuntime.createClass)(Spearal, {}, {
  get APPLICATION_SPEARAL() {
    "use strict";
    return "application/spearal";
  },
  get PROPERTY_FILTER_HEADER() {
    "use strict";
    return "Spearal-PropertyFilter";
  },
  filterHeader: function(className) {
    "use strict";
    for (var propertyNames = [],
        $__1 = 1; $__1 < arguments.length; $__1++)
      propertyNames[$traceurRuntime.toProperty($__1 - 1)] = arguments[$traceurRuntime.toProperty($__1)];
    return className + '#' + propertyNames.join(',');
  }
});
var SpearalBigNumber = function SpearalBigNumber() {
  "use strict";
};
($traceurRuntime.createClass)(SpearalBigNumber, {}, {
  charAt: function(index) {
    "use strict";
    var c = "0123456789+-.E".charAt(index);
    if (c === "")
      throw "Illegal big number digit index: " + index;
    return c;
  },
  indexOf: function(charCode) {
    "use strict";
    switch (charCode) {
      case 0x30:
        return 0;
      case 0x31:
        return 1;
      case 0x32:
        return 2;
      case 0x33:
        return 3;
      case 0x34:
        return 4;
      case 0x35:
        return 5;
      case 0x36:
        return 6;
      case 0x37:
        return 7;
      case 0x38:
        return 8;
      case 0x39:
        return 9;
      case 0x2b:
        return 10;
      case 0x2d:
        return 11;
      case 0x2e:
        return 12;
      case 0x45:
      case 0x65:
        return 13;
      default:
        throw "Illegal big number digit code: " + charCode;
    }
  }
});
var SpearalType = function SpearalType() {
  "use strict";
};
($traceurRuntime.createClass)(SpearalType, {}, {
  get NULL() {
    "use strict";
    return 0x00;
  },
  get TRUE() {
    "use strict";
    return 0x01;
  },
  get FALSE() {
    "use strict";
    return 0x02;
  },
  get INTEGRAL() {
    "use strict";
    return 0x10;
  },
  get BIG_INTEGRAL() {
    "use strict";
    return 0x20;
  },
  get FLOATING() {
    "use strict";
    return 0x30;
  },
  get BIG_FLOATING() {
    "use strict";
    return 0x40;
  },
  get STRING() {
    "use strict";
    return 0x50;
  },
  get BYTE_ARRAY() {
    "use strict";
    return 0x60;
  },
  get DATE_TIME() {
    "use strict";
    return 0x70;
  },
  get COLLECTION() {
    "use strict";
    return 0x80;
  },
  get MAP() {
    "use strict";
    return 0x90;
  },
  get ENUM() {
    "use strict";
    return 0xa0;
  },
  get CLASS() {
    "use strict";
    return 0xb0;
  },
  get BEAN() {
    "use strict";
    return 0xc0;
  },
  typeOf: function(parameterizedType) {
    "use strict";
    if (parameterizedType < 0x10)
      return parameterizedType;
    return (parameterizedType & 0xf0);
  }
});
var _SpearalClassDescriptor = function _SpearalClassDescriptor(className, propertyNames) {
  "use strict";
  this.className = className;
  this.propertyNames = propertyNames;
};
var $_SpearalClassDescriptor = _SpearalClassDescriptor;
($traceurRuntime.createClass)(_SpearalClassDescriptor, {get description() {
    "use strict";
    return this.className + '#' + this.propertyNames.join(',');
  }}, {forDescription: function(description) {
    "use strict";
    var classProperties = description.split('#');
    return new $_SpearalClassDescriptor(classProperties[0], classProperties[1].split(','));
  }});
var SpearalContext = function SpearalContext() {
  "use strict";
  this._configurables = [];
  this._encodersCache = new Map();
  this._decodersCache = new Map();
};
($traceurRuntime.createClass)(SpearalContext, {
  get configurables() {
    "use strict";
    return this._configurables;
  },
  normalize: function(value) {
    "use strict";
    return value;
  },
  _findConfigurable: function(name) {
    "use strict";
    var param = arguments[1];
    for (var $__1 = this._configurables[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__2; !($__2 = $__1.next()).done; ) {
      var configurable = $__2.value;
      {
        var configurableFunction = configurable[$traceurRuntime.toProperty(name)];
        if (configurableFunction !== undefined) {
          if (param !== undefined)
            configurableFunction = configurableFunction(param);
          if (configurableFunction !== undefined)
            return configurableFunction;
        }
      }
    }
  },
  getDescriptor: function(value) {
    "use strict";
    var filter = arguments[1] !== (void 0) ? arguments[1] : null;
    if (this._descriptor == null) {
      if ((this._descriptor = this._findConfigurable('descriptor')) == null)
        throw "No descriptor for value: " + value;
    }
    return this._descriptor(value, filter);
  },
  getEncoder: function(value) {
    "use strict";
    var type = value.constructor,
        encoder = this._encodersCache.get(type);
    if (encoder == null) {
      if ((encoder = this._findConfigurable('encoder', value)) == null)
        throw "No encoder for type: " + value;
      this._encodersCache.set(type, encoder);
    }
    return encoder;
  },
  getInstance: function(descriptor) {
    "use strict";
    if (this._instantiator == null) {
      if ((this._instantiator = this._findConfigurable('instantiator')) == null)
        throw "No instantiator for value: " + value;
    }
    return this._instantiator(descriptor);
  },
  getDecoder: function(type) {
    "use strict";
    var decoder = this._decodersCache.get(type);
    if (decoder == null) {
      if ((decoder = this._findConfigurable('decoder', type)) == null)
        throw "No decoder for type: " + type;
      this._decodersCache.set(type, decoder);
    }
    return decoder;
  }
}, {});
var _SpearalEncoderBuffer = function _SpearalEncoderBuffer() {
  "use strict";
  var blockSize = arguments[0] !== (void 0) ? arguments[0] : 128;
  this._view = new DataView(new ArrayBuffer(blockSize));
  this._blockSize = blockSize;
  this._size = 0;
};
($traceurRuntime.createClass)(_SpearalEncoderBuffer, {
  get size() {
    "use strict";
    return this._size;
  },
  getBuffer: function() {
    "use strict";
    var trim = arguments[0] !== (void 0) ? arguments[0] : true;
    if (!trim || this._size === this._view.buffer.byteLength)
      return this._view.buffer;
    return this._view.buffer.slice(0, this._size);
  },
  writeUint8: function(value) {
    "use strict";
    this._ensureCapacity(1);
    this._view.setUint8(this._size++, value);
  },
  writeUintN: function(value, length0) {
    "use strict";
    if (length0 < 0 || length0 > 3)
      throw "Illegal length0: " + length0;
    this._ensureCapacity(length0 + 1);
    switch (length0) {
      case 3:
        this._view.setUint32(this._size, value);
        this._size += 4;
        break;
      case 2:
        this._view.setUint8(this._size++, value >>> 16);
      case 1:
        this._view.setUint16(this._size, value);
        this._size += 2;
        break;
      case 0:
        this._view.setUint8(this._size++, value);
        break;
    }
  },
  writeFloat64: function(value) {
    "use strict";
    this._ensureCapacity(8);
    this._view.setFloat64(this._size, value);
    this._size += 8;
  },
  writeUTF: function(utf) {
    "use strict";
    this._ensureCapacity(utf.length);
    for (var i = 0; i < utf.length; i++)
      this._view.setUint8(this._size++, utf.charCodeAt(i));
  },
  writeByteArray: function(buffer) {
    "use strict";
    this._ensureCapacity(buffer.byteLength);
    new Uint8Array(this._view.buffer, this._size).set(new Uint8Array(buffer));
    this._size += buffer.byteLength;
  },
  _ensureCapacity: function(length) {
    "use strict";
    if (this._view.buffer.byteLength - this._size < length) {
      var newCapacity = (this._view.buffer.byteLength + (((length / this._blockSize) | 0) * this._blockSize) + this._blockSize);
      var tmp = new Uint8Array(newCapacity);
      tmp.set(new Uint8Array(this._view.buffer), 0, this._size);
      this._view = new DataView(tmp.buffer);
    }
  }
}, {});
var SpearalPropertyFilter = function SpearalPropertyFilter() {
  "use strict";
  this._filters = new Map();
};
($traceurRuntime.createClass)(SpearalPropertyFilter, {
  set: function(className) {
    "use strict";
    for (var propertyNames = [],
        $__3 = 1; $__3 < arguments.length; $__3++)
      propertyNames[$traceurRuntime.toProperty($__3 - 1)] = arguments[$traceurRuntime.toProperty($__3)];
    if (!(propertyNames instanceof Set))
      propertyNames = new Set(propertyNames);
    this._filters.set(className, propertyNames);
  },
  get: function(className) {
    "use strict";
    return this._filters.get(className);
  }
}, {});
SpearalPropertyFilter.ACCEPT_ALL = {has: function(value) {
    return true;
  }};
var SpearalEncoder = function SpearalEncoder(context, filter) {
  "use strict";
  if (!(context instanceof SpearalContext))
    throw "Parameter 'context' must be a SpearalContext instance: " + context;
  if (filter != null && !(filter instanceof SpearalPropertyFilter))
    throw "Parameter 'filter' must be a SpearalPropertyFilter instance: " + filter;
  this._context = context;
  this._filter = (filter != null ? filter : new SpearalPropertyFilter());
  this._buffer = new _SpearalEncoderBuffer();
  this._sharedStrings = new Map();
  this._sharedObjects = new Map();
};
var $SpearalEncoder = SpearalEncoder;
($traceurRuntime.createClass)(SpearalEncoder, {
  get context() {
    "use strict";
    return this._context;
  },
  get filter() {
    "use strict";
    return this._filter;
  },
  get buffer() {
    "use strict";
    return this._buffer.getBuffer();
  },
  writeAny: function(value) {
    "use strict";
    value = this._context.normalize(value);
    if (value == null)
      this.writeNull();
    else
      this._context.getEncoder(value)(this, value);
  },
  writeNull: function() {
    "use strict";
    this._buffer.writeUint8(SpearalType.NULL);
  },
  writeBoolean: function(value) {
    "use strict";
    this._buffer.writeUint8(value ? SpearalType.TRUE : SpearalType.FALSE);
  },
  writeIntegral: function(value) {
    "use strict";
    var inverse = 0x00;
    if (value < 0) {
      value = -value;
      inverse = 0x08;
    }
    if (value <= 0xffffffff)
      this._writeTypeUintN(SpearalType.INTEGRAL | inverse, value);
    else {
      var high32 = ((value / 0x100000000) | 0x00),
          length0 = $SpearalEncoder._unsignedIntLength0(high32);
      this._buffer.writeUint8(SpearalType.INTEGRAL | inverse | (length0 + 4));
      this._buffer.writeUintN(high32, length0);
      this._buffer.writeUintN(value & 0xffffffff, 3);
    }
  },
  writeBigIntegral: function(value) {
    "use strict";
    this._writeBigNumberData(SpearalType.BIG_INTEGRAL, this._exponentize(value));
  },
  writeFloating: function(value) {
    "use strict";
    if (Number.isFinite(value) && !(value === 0 && (1 / value) === Number.NEGATIVE_INFINITY)) {
      if (Number.isInteger(value)) {
        if (value >= -0x00ffffffffffffff && value <= 0x00ffffffffffffff) {
          this.writeIntegral(value);
          return;
        }
      } else {
        var value1K = value * 1000.0;
        if (Number.isInteger(value1K) && (value === (value1K / 1000.0) || value === ((value1K += (value1K < 0 ? -1 : 1)) / 1000.0)) && value1K >= -0xffffffff && value1K <= 0xffffffff) {
          var inverse = 0x00;
          if (value1K < 0) {
            value1K = -value1K;
            inverse = 0x04;
          }
          this._writeTypeUintN(SpearalType.FLOATING | 0x08 | inverse, value1K);
          return;
        }
      }
    }
    this._buffer.writeUint8(SpearalType.FLOATING);
    this._buffer.writeFloat64(value);
  },
  writeBigFloating: function(value) {
    "use strict";
    this._writeBigNumberData(SpearalType.BIG_FLOATING, value);
  },
  writeString: function(value) {
    "use strict";
    this._writeStringData(SpearalType.STRING, value);
  },
  writeByteArray: function(value) {
    "use strict";
    if (!this._setAndWriteObjectReference(SpearalType.BYTE_ARRAY, value)) {
      this._writeTypeUintN(SpearalType.BYTE_ARRAY, value.byteLength);
      this._buffer.writeByteArray(value);
    }
  },
  writeDateTime: function(value) {
    "use strict";
    if (Number.isNaN(value.getTime())) {
      this.writeNull();
      return;
    }
    var year = value.getUTCFullYear() - 2000,
        millis = value.getUTCMilliseconds();
    this._buffer.writeUint8(SpearalType.DATE_TIME | 0x0C | (millis !== 0 ? 0x03 : 0x00));
    var inverse = 0x00;
    if (year < 0) {
      inverse = 0x80;
      year = -year;
    }
    var length0 = $SpearalEncoder._unsignedIntLength0(year);
    this._buffer.writeUint8(inverse | (length0 << 4) | (value.getUTCMonth() + 1));
    this._buffer.writeUint8(value.getUTCDate());
    this._buffer.writeUintN(year, length0);
    if (millis === 0) {
      this._buffer.writeUint8(value.getUTCHours());
      this._buffer.writeUint8(value.getUTCMinutes());
      this._buffer.writeUint8(value.getUTCSeconds());
    } else {
      length0 = $SpearalEncoder._unsignedIntLength0(millis);
      this._buffer.writeUint8((length0 << 5) | value.getUTCHours());
      this._buffer.writeUint8(value.getUTCMinutes());
      this._buffer.writeUint8(value.getUTCSeconds());
      this._buffer.writeUintN(millis, length0);
    }
  },
  writeCollection: function(value) {
    "use strict";
    if (!this._setAndWriteObjectReference(SpearalType.COLLECTION, value)) {
      var size = (value instanceof Set ? value.size : value.length);
      this._writeTypeUintN(SpearalType.COLLECTION, size);
      for (var $__1 = value[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__2; !($__2 = $__1.next()).done; ) {
        var item = $__2.value;
        this.writeAny(item);
      }
    }
  },
  writeMap: function(value) {
    "use strict";
    if (!this._setAndWriteObjectReference(SpearalType.MAP, value)) {
      this._writeTypeUintN(SpearalType.MAP, value.size);
      for (var $__1 = value[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__2; !($__2 = $__1.next()).done; ) {
        var $__4 = $__2.value,
            key = $__4[0],
            val = $__4[1];
        {
          this.writeAny(key);
          this.writeAny(val);
        }
      }
    }
  },
  writeEnum: function(kind, name) {
    "use strict";
    this._writeStringData(SpearalType.ENUM, kind);
    this.writeString(name);
  },
  writeClass: function(value) {
    "use strict";
    this._writeStringData(SpearalType.CLASS, value.name);
  },
  writeBean: function(value) {
    "use strict";
    if (!this._setAndWriteObjectReference(SpearalType.BEAN, value)) {
      var descriptor = this._context.getDescriptor(value, this._filter);
      this._writeStringData(SpearalType.BEAN, descriptor.description);
      for (var $__1 = descriptor.propertyNames[$traceurRuntime.toProperty(Symbol.iterator)](),
          $__2; !($__2 = $__1.next()).done; ) {
        var name = $__2.value;
        this.writeAny(value[$traceurRuntime.toProperty(name)]);
      }
    }
  },
  _writeStringData: function(type, value) {
    "use strict";
    if (value.length === 0) {
      this._buffer.writeUint8(type);
      this._buffer.writeUint8(0);
      return;
    }
    if (!this._setAndWriteStringReference(type, value)) {
      value = unescape(encodeURIComponent(value));
      this._writeTypeUintN(type, value.length);
      this._buffer.writeUTF(value);
    }
  },
  _exponentize: function(value) {
    "use strict";
    var length = value.length;
    if (length > 3) {
      var trailingZeros = 0;
      for (var i = length - 1; i > 0 && value.charAt(i) == '0'; i--)
        trailingZeros++;
      if (trailingZeros > 2)
        value = value.substring(0, length - trailingZeros) + "E" + trailingZeros;
    }
    return value;
  },
  _writeBigNumberData: function(type, value) {
    "use strict";
    if (!this._setAndWriteStringReference(type, value)) {
      var length = value.length;
      this._writeTypeUintN(type, length);
      for (var i = 0; i < length; ) {
        var b = (SpearalBigNumber.indexOf(value.charCodeAt(i++)) << 4);
        if (i < length)
          b |= SpearalBigNumber.indexOf(value.charCodeAt(i++));
        this._buffer.writeUint8(b);
      }
    }
  },
  _setAndWriteObjectReference: function(type, value) {
    "use strict";
    var index = this._sharedObjects.get(value);
    if (index !== undefined) {
      this._writeTypeUintN(type | 0x08, index);
      return true;
    }
    this._sharedObjects.set(value, this._sharedObjects.size);
    return false;
  },
  _setAndWriteStringReference: function(type, value) {
    "use strict";
    var index = this._sharedStrings.get(value);
    if (index !== undefined) {
      this._writeTypeUintN(type | 0x04, index);
      return true;
    }
    this._sharedStrings.set(value, this._sharedStrings.size);
    return false;
  },
  _writeTypeUintN: function(type, value) {
    "use strict";
    var length0 = $SpearalEncoder._unsignedIntLength0(value);
    this._buffer.writeUint8(type | length0);
    this._buffer.writeUintN(value, length0);
  }
}, {_unsignedIntLength0: function(value) {
    "use strict";
    if (value <= 0xffff)
      return (value <= 0xff ? 0 : 1);
    return (value <= 0xffffff ? 2 : 3);
  }});
var _SpearalDecoderBuffer = function _SpearalDecoderBuffer(arrayBuffer) {
  "use strict";
  this._view = new DataView(arrayBuffer);
  this._pos = 0;
};
($traceurRuntime.createClass)(_SpearalDecoderBuffer, {
  readUint8: function() {
    "use strict";
    try {
      return this._view.getUint8(this._pos++);
    } catch (e) {
      throw "EOF: " + e;
    }
  },
  readUintN: function(length0) {
    "use strict";
    if (length0 < 0 || length0 > 3)
      throw "Illegal length0: " + length0;
    try {
      var value = 0;
      switch (length0) {
        case 3:
          value = this._view.getUint32(this._pos);
          this._pos += 4;
          break;
        case 2:
          value = this._view.getUint8(this._pos++) << 16;
        case 1:
          value |= this._view.getUint16(this._pos);
          this._pos += 2;
          break;
        case 0:
          value = this._view.getUint8(this._pos++);
          break;
      }
      return value;
    } catch (e) {
      throw "EOF: " + e;
    }
  },
  readFloat64: function() {
    "use strict";
    try {
      var value = this._view.getFloat64(this._pos);
      this._pos += 8;
      return value;
    } catch (e) {
      throw "EOF: " + e;
    }
  },
  readUTF: function(length) {
    "use strict";
    try {
      var utf = String.fromCharCode.apply(null, new Uint8Array(this._view.buffer, this._pos, length));
      this._pos += length;
      return utf;
    } catch (e) {
      throw "EOF: " + e;
    }
  },
  readByteArray: function(length) {
    "use strict";
    if (!length)
      return new ArrayBuffer(0);
    var end = this._pos + length;
    if (end > this._view.buffer.byteLength)
      throw "EOF: cannot read " + length + " bytes";
    var array = this._view.buffer.slice(this._pos, end);
    this._pos = end;
    return array;
  }
}, {});
var SpearalDecoder = function SpearalDecoder(context, buffer) {
  "use strict";
  if (!(context instanceof SpearalContext))
    throw "Parameter 'context' must be a SpearalContext";
  if (!(buffer instanceof ArrayBuffer))
    throw "Parameter 'buffer' must be an ArrayBuffer";
  this._context = context;
  this._buffer = new _SpearalDecoderBuffer(buffer);
  this._sharedStrings = [];
  this._sharedObjects = [];
};
var $SpearalDecoder = SpearalDecoder;
($traceurRuntime.createClass)(SpearalDecoder, {
  readAny: function() {
    "use strict";
    return this._readAny(this._buffer.readUint8());
  },
  _readAny: function(parameterizedType) {
    "use strict";
    var type = SpearalType.typeOf(parameterizedType),
        value = null;
    switch (type) {
      case SpearalType.NULL:
        value = null;
        break;
      case SpearalType.TRUE:
        value = true;
        break;
      case SpearalType.FALSE:
        value = false;
        break;
      case SpearalType.INTEGRAL:
        value = this._readIntegral(parameterizedType);
        break;
      case SpearalType.BIG_INTEGRAL:
        value = this._readBigIntegral(parameterizedType);
        break;
      case SpearalType.FLOATING:
        value = this._readFloating(parameterizedType);
        break;
      case SpearalType.BIG_FLOATING:
        value = this._readBigFloating(parameterizedType);
        break;
      case SpearalType.STRING:
        value = this._readString(parameterizedType);
        break;
      case SpearalType.BYTE_ARRAY:
        value = this._readByteArray(parameterizedType);
        break;
      case SpearalType.DATE_TIME:
        value = this._readDateTime(parameterizedType);
        break;
      case SpearalType.COLLECTION:
        value = this._readCollection(parameterizedType);
        break;
      case SpearalType.MAP:
        value = this._readMap(parameterizedType);
        break;
      case SpearalType.ENUM:
        value = this._readEnum(parameterizedType);
        break;
      case SpearalType.CLASS:
        value = this._readClass(parameterizedType);
        break;
      case SpearalType.BEAN:
        value = this._readBean(parameterizedType);
        break;
      default:
        throw new "Unknown data type: " + parameterizedType + "/" + SpearalType.typeOf(parameterizedType);
    }
    return this._context.getDecoder(type)(value);
  },
  _readIntegral: function(parameterizedType) {
    "use strict";
    var length0 = (parameterizedType & 0x07),
        value;
    if (length0 <= 3)
      value = this._buffer.readUintN(length0);
    else
      value = (this._buffer.readUintN(3) * Math.pow(256, length0 - 3)) + this._buffer.readUintN(length0 - 4);
    return (((parameterizedType & 0x08) !== 0) ? -value : value);
  },
  _readBigIntegral: function(parameterizedType) {
    "use strict";
    var indexOrLength = this._readIndexOrLength(parameterizedType);
    if ($SpearalDecoder._isStringReference(parameterizedType))
      return this._sharedStrings[$traceurRuntime.toProperty(indexOrLength)];
    var value = this._readBigNumberData(indexOrLength),
        iExp = value.indexOf('E');
    if (iExp === -1)
      return value;
    var zeros = parseInt(value.substr(iExp + 1));
    value = value.substring(0, iExp);
    for (var i = 0; i < zeros; i++)
      value += '0';
    return value;
  },
  _readFloating: function(parameterizedType) {
    "use strict";
    if ((parameterizedType & 0x08) === 0)
      return this._buffer.readFloat64();
    var v = this._buffer.readUintN(parameterizedType & 0x03);
    if ((parameterizedType & 0x04) !== 0)
      v = -v;
    return (v / 1000.0);
  },
  _readBigFloating: function(parameterizedType) {
    "use strict";
    var indexOrLength = this._readIndexOrLength(parameterizedType);
    if ($SpearalDecoder._isStringReference(parameterizedType))
      return this._sharedStrings[$traceurRuntime.toProperty(indexOrLength)];
    return this._readBigNumberData(indexOrLength);
  },
  _readString: function(parameterizedType) {
    "use strict";
    var indexOrLength = this._readIndexOrLength(parameterizedType);
    return this._readStringData(parameterizedType, indexOrLength);
  },
  _readByteArray: function(parameterizedType) {
    "use strict";
    var indexOrLength = this._readIndexOrLength(parameterizedType);
    if ($SpearalDecoder._isObjectReference(parameterizedType))
      return this._sharedObjects[$traceurRuntime.toProperty(indexOrLength)];
    var array = this._buffer.readByteArray(indexOrLength);
    this._sharedObjects.push(array);
    return array;
  },
  _readDateTime: function(parameterizedType) {
    "use strict";
    var hasDate = ((parameterizedType & 0x08) != 0),
        hasTime = ((parameterizedType & 0x04) != 0),
        year = 0,
        month = 0,
        date = 0,
        hours = 0,
        minutes = 0,
        seconds = 0,
        millis = 0,
        subsecondsType;
    if (hasDate) {
      month = this._buffer.readUint8();
      date = this._buffer.readUint8();
      year = this._buffer.readUintN((month >>> 4) & 0x03);
      if ((month & 0x80) != 0)
        year = -year;
      year += 2000;
      month &= 0x0f;
      month--;
    }
    if (hasTime) {
      hours = this._buffer.readUint8();
      minutes = this._buffer.readUint8();
      seconds = this._buffer.readUint8();
      subsecondsType = (parameterizedType & 0x03);
      if (subsecondsType !== 0) {
        millis = this._buffer.readUintN(hours >>> 5);
        if (subsecondsType === 1)
          millis /= 1000000;
        else if (subsecondsType === 2)
          millis /= 1000;
      }
      hours &= 0x1f;
    }
    return new Date(Date.UTC(year, month, date, hours, minutes, seconds, millis));
  },
  _readCollection: function(parameterizedType) {
    "use strict";
    var indexOrLength = this._readIndexOrLength(parameterizedType);
    if ($SpearalDecoder._isObjectReference(parameterizedType))
      return this._sharedObjects[$traceurRuntime.toProperty(indexOrLength)];
    var value = new Array(indexOrLength);
    this._sharedObjects.push(value);
    for (var i = 0; i < indexOrLength; i++)
      value[$traceurRuntime.toProperty(i)] = this.readAny();
    return value;
  },
  _readMap: function(parameterizedType) {
    "use strict";
    var indexOrLength = this._readIndexOrLength(parameterizedType);
    if ($SpearalDecoder._isObjectReference(parameterizedType))
      return this._sharedObjects[$traceurRuntime.toProperty(indexOrLength)];
    var value = new Map();
    this._sharedObjects.push(value);
    for (var i = 0; i < indexOrLength; i++) {
      var key = this.readAny();
      var val = this.readAny();
      value.set(key, val);
    }
    return value;
  },
  _readEnum: function(parameterizedType) {
    "use strict";
    return {
      kind: this._readString(parameterizedType),
      name: this.readAny()
    };
  },
  _readClass: function(parameterizedType) {
    "use strict";
    var className = this._readString(parameterizedType),
        cls = window[$traceurRuntime.toProperty(className)];
    return (cls != null ? cls : className);
  },
  _readBean: function(parameterizedType) {
    "use strict";
    var indexOrLength = this._readIndexOrLength(parameterizedType);
    if ($SpearalDecoder._isObjectReference(parameterizedType))
      return this._sharedObjects[$traceurRuntime.toProperty(indexOrLength)];
    var description = this._readStringData(parameterizedType, indexOrLength),
        descriptor = _SpearalClassDescriptor.forDescription(description),
        value = this._context.getInstance(descriptor);
    this._sharedObjects.push(value);
    for (var $__1 = descriptor.propertyNames[$traceurRuntime.toProperty(Symbol.iterator)](),
        $__2; !($__2 = $__1.next()).done; ) {
      var name = $__2.value;
      value[$traceurRuntime.toProperty(name)] = this.readAny();
    }
    return value;
  },
  _readBigNumberData: function(length) {
    "use strict";
    var count = (length / 2) + (length % 2),
        value = "";
    for (var i = 0; i < count; i++) {
      var b = this._buffer.readUint8();
      value += SpearalBigNumber.charAt((b & 0xf0) >>> 4);
      if (value.length === length)
        break;
      value += SpearalBigNumber.charAt(b & 0x0f);
    }
    this._sharedStrings.push(value);
    return value;
  },
  _readIndexOrLength: function(parameterizedType) {
    "use strict";
    return this._buffer.readUintN(parameterizedType & 0x03);
  },
  _readStringData: function(parameterizedType, indexOrLength) {
    "use strict";
    if ($SpearalDecoder._isStringReference(parameterizedType))
      return this._sharedStrings[$traceurRuntime.toProperty(indexOrLength)];
    if (indexOrLength === 0)
      return "";
    var value = decodeURIComponent(escape(this._buffer.readUTF(indexOrLength)));
    this._sharedStrings.push(value);
    return value;
  }
}, {
  _isObjectReference: function(parameterizedType) {
    "use strict";
    return ((parameterizedType & 0x08) !== 0);
  },
  _isStringReference: function(parameterizedType) {
    "use strict";
    return ((parameterizedType & 0x04) !== 0);
  }
});
var SpearalFactory = function SpearalFactory() {
  "use strict";
  this._context = new SpearalContext();
  this._context.configurables.push({
    descriptor: function(value, filter) {
      var className = value._class;
      if (className == null)
        className = value.constructor.name;
      if (className == null)
        className = '';
      if (filter != null)
        filter = filter.get(className);
      if (filter == null)
        filter = SpearalPropertyFilter.ACCEPT_ALL;
      var propertyNames = [];
      for (var property in value)
        if (!$traceurRuntime.isSymbolString(property)) {
          if (property !== '_class' && value.hasOwnProperty(property) && filter.has(property))
            propertyNames.push(property);
        }
      return new _SpearalClassDescriptor(className, propertyNames);
    },
    encoder: function(value) {
      switch (value.constructor) {
        case Boolean:
          return function(encoder, value) {
            encoder.writeBoolean(value);
          };
        case Number:
          return function(encoder, value) {
            encoder.writeFloating(value);
          };
        case String:
          return function(encoder, value) {
            encoder.writeString(value);
          };
        case Function:
          return function(encoder, value) {
            encoder.writeClass(value);
          };
        case Date:
          return function(encoder, value) {
            encoder.writeDateTime(value);
          };
        case ArrayBuffer:
          return function(encoder, value) {
            encoder.writeByteArray(value);
          };
        case Int8Array:
        case Uint8Array:
        case Int16Array:
        case Uint16Array:
        case Int32Array:
        case Uint32Array:
        case Float32Array:
        case Float64Array:
        case DataView:
          return function(encoder, value) {
            encoder.writeByteArray(value.buffer);
          };
        case Array:
          return function(encoder, value) {
            encoder.writeCollection(value);
          };
        case Set:
          return function(encoder, value) {
            encoder.writeCollection(value);
          };
        case Map:
          return function(encoder, value) {
            encoder.writeMap(value);
          };
        default:
          return function(encoder, value) {
            encoder.writeBean(value);
          };
      }
    },
    instantiator: function(descriptor) {
      if (descriptor.className === '')
        return {};
      if (window[$traceurRuntime.toProperty(descriptor.className)])
        return new window[$traceurRuntime.toProperty(descriptor.className)]();
      return {_class: descriptor.className};
    },
    decoder: function(type) {
      return function(value) {
        return value;
      };
    }
  });
};
($traceurRuntime.createClass)(SpearalFactory, {
  configure: function(configurable) {
    "use strict";
    this._context.configurables.unshift(configurable);
  },
  get context() {
    "use strict";
    return this._context;
  },
  newEncoder: function(filter) {
    "use strict";
    return new SpearalEncoder(this._context, filter);
  },
  newDecoder: function(buffer) {
    "use strict";
    return new SpearalDecoder(this._context, buffer);
  }
}, {});

//# sourceMappingURL=spearal.map
