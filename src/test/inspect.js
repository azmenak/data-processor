import util from 'util';

export default function log(data) {
  console.log(
    util.inspect(data, {
      depth: 10,
      colors: true
    })
  )
  return data;
}
