export function APIreq(options, callback) {
    const url = "/api" + options.url
    const method = options.method ?? "get"
    const body = options.body
    
    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
            'Accept': 'application/json'
        },
        body: JSON.stringify(body),
    })
    .then(res => {
        if (res.status !== 404) {
            res.json().then(json => {
                callback(res.status, json)
            })
        }
    })
}

export function splitCubicBezier(curve, t) {
    const x1 = curve[0],
    y1 = curve[1],
    x2 = curve[2],
    y2 = curve[3]

    const z = t,
    cz = z-1,
    z2 = z*z,
    cz2 = cz*cz,
    z3 = z2*z

    const splitX = z3 - 3*z2*cz*x2 + 3*z*cz2*x1
    const splitY = z3 - 3*z2*cz*y2 + 3*z*cz2*y1

    const scaleLeftX = 1 / splitX
    const scaleLeftY = 1 / splitY


    const left = [
        (z*x1) * scaleLeftX, 
        (z*y1) * scaleLeftY, 
        (z2*x2 - 2*z*cz*x1) * scaleLeftX,
        (z2*y2 - 2*z*cz*y1) * scaleLeftY
    ];

    const scaleRightX = 1 / (1 - splitX)
    const scaleRightY = 1 / (1 - splitY)

    const right = [
        (z2 - 2*z*cz*x2 + cz2*x1 - splitX) * scaleRightX,
        (z2 - 2*z*cz*y2 + cz2*y1 - splitY) * scaleRightY,
                        (z - cz*x2 - splitX) * scaleRightX, 
                        (z - cz*y2 - splitY) * scaleRightY
    ];

    return {
        left: left,
        right: right,
        progress: splitX
    }
}

export function curveGetTfromY(curve, y) {
    const crt = function(v) {
        if(v<0) return -Math.pow(-v, 1/3)
        return Math.pow(v, 1/3)
    }

    const pa = -y,
        pb = curve[1] - y,
        pc = curve[3] - y,
        pd = 1 - y,
        // pa = x,
        // pb = x - curve[0],
        // pc = x - curve[2],
        // pd = x - 1,
        d = (  -pa + 3*pb - 3*pc + pd),
        a = ( 3*pa - 6*pb + 3*pc) / d,
        b = (-3*pa + 3*pb) / d,
        c = pa / d,
        p = (3*b - a*a)/3,
        q = (2*a*a*a - 9*a*b + 27*c)/27,
        q2 = q/2,
        p3 = p/3,
        discriminant = q2*q2 + p3*p3*p3
    
    if (discriminant < 0) {
        const mp3 = -p/3,
            mp33 = mp3*mp3*mp3,
            r = Math.sqrt( mp33 ),
            t = -q/(2*r),
            cosphi = t<-1 ? -1 : t>1 ? 1 : t,
            phi = Math.acos(cosphi),
            crtr = crt(r),
            t1 = 2*crtr


        const x1 = t1 * Math.cos(phi/3) - a/3
        if (x1 < 1 && x1 > 0) {
            return x1
        }

        const x2 = t1 * Math.cos((phi+2*Math.PI)/3) - a/3
        if (x2 < 1 && x2 > 0) {
            return x2
        }
        
        const x3 = t1 * Math.cos((phi+2*2*Math.PI)/3) - a/3
        return x3
    }
    else if(discriminant === 0) {
        const u1 = q2 < 0 ? crt(-q2) : -crt(q2);
        
        const x1 = 2*u1-a/3;
        return x1
    }
    else {
        const sd = Math.sqrt(discriminant)
        const u1 = crt(-q2+sd)
        const v1 = crt(q2+sd)
        const x1 =  u1 - v1 - a/3;
        return x1
    }
}
