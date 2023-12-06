// const jwt = require('jsonwebtoken');
// // const config = require('../APIs/config/serverConfig.json')
// const PublicKey = require('/home/ubuntu/bookstore/keys/public_key.pem')

// class JWT {

//     ensure(req, res, next) {
//         const header = req.headers["authorization"];

//         try {
//             const bearer = header.split(" ");
//             if (bearer.length > 1) {
//                 const token = bearer[1];
//                 req.token = token;
//                 next();
//             }
//             else {
//                 console.log("Internal Server Error");
//                 res.sendStatus(403)

//             }
//         } catch (error) {
//             console.log(error)
//             res.sendStatus(403)
//         }
//     }


//     async verify(token) {
//         const public_key = await PublicKey.readPublicKey();

//         let check = 0;
//         var verifyOprions = {
//             algorithms: ["RS256"]
//         }

//         jwt.verify(token, public_key, verifyOprions, (err_jwt, res_jwt) => {
//             if (err_jwt) {
//                 check = 0;
//             } else {
//                 check = 1;
//             }
//         });
//         return check;
//     }
// }

// module.exports = new JWT();

const jwt = require('jsonwebtoken');
const fs = require('fs').promises;  // Using promises version of fs for async/await

const publicKeyPath = '/home/ubuntu/bookstore/keys/public_key.pem';

class JWT {
    async readPublicKey() {
        try {
            const publicKey = await fs.readFile(publicKeyPath, 'utf8');
            return publicKey;
        } catch (error) {
            console.error('Error reading public key:', error);
            throw error;
        }
    }

    ensure(req, res, next) {
        const header = req.headers['authorization'];
console.log(header)
        try {
            const bearer = header.split(' ');
            if (bearer.length > 1) {
                const token = bearer[1];
                req.token = token;
                next();
            } else {
                console.log('Internal Server Error');
                res.sendStatus(403);
            }
        } catch (error) {
            console.log(error);
            res.sendStatus(403);
        }
    }

    async verify(token) {
        const public_key = await this.readPublicKey();

        let check = 0;
        const verifyOptions = {
            algorithms: ['RS256']
        };

        jwt.verify(token, public_key, verifyOptions, (err_jwt, res_jwt) => {
            if (err_jwt) {
                check = 0;
            } else {
                check = 1;
            }
        });
        return check;
    }
}

module.exports = new JWT();
