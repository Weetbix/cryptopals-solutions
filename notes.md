6 - Break repeating key XOR
I had trouble with small key sizes being ranked higher chance
than the real key, so I increased the minimum key size a few values
oher than that I got the exact key length by rank 1

7 - AES in ECB
I dont think the intention of this one is to implement AES ECB Yourself
I looked into that and it would be heaps of work... instead it just seems
that you should have CODE that encrypts in AES ECB using a library

I was lucky and the library I picked allowed me to apply ECB to single bytes
without any padding! You can check if it pads by putting in a 16 byte input
you should get 16 bytes out. This means I can use it just like a normal block cipher
later for implementing cBC modes

8 - Detect AES in ECB
Reasonably fast to implement - Every result has 0 repeated blocks except the one that is ECB encrypted

9 - Implement PKCS7 Padding
Quite simple and fast...

10 - Implementing CBC mode
The challenge is not so clear previously about the padding - if you try to verify your results with an online tool they will implement
the padding correctly which means if your data is an exact multiple of 16
you need another block of empty padding. So this can be confusing to
verify when you are getting different results.

For example I was encrypting "YELLOW SUBMARINEYELLOW SUBARMINE" and ending up
with a result that was 16 bytes shorter than the results from the internet pages!

Note: Check if your EBC encryption is padding!!

Quite a long one, recommedned as one 2week study period.

I implemented it with padding

12 - byte at a time ecb decryption
Wow this one is fun
The block size detection was fun to work out theoretically.
This is NOT the same as the key size detection for repeating key XOR
as the algorithms are way different. 
You should consider the weaknesses in AES when trying to work out how to 
detect this.