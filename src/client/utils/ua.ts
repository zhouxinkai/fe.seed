const device = {
  Android() {
    const keys = ['Chrome', 'AppleWebKit', 'QQBrowser', 'Safari', 'UCBrowser', 'MicroMessenger', 'AlipayClient', 'Android']
    const values = {} as {[k: string]: string}

    keys.forEach(k => {
      const v = value(k)
      if (v) { values[k] = v }
    })

    return values
  },
  // iPhone
}

const fields = navigator.userAgent.split(/[ |/]/);

function value(key: string) {
  let index = fields.findIndex(field => field === key)

  if (index && fields[index + 1]) {
    const describe = fields[index + 1]
    const matched = /^\d+\.\d+/.exec(describe)
    return matched && matched[0]
  }
}

export function getEnvironment() {
  if (navigator.userAgent.indexOf('Android') >= 0) {
    return device.Android()
  }
}


