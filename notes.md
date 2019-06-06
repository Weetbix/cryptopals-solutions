6 - Break repeating key XOR - I had trouble with small key sizes being ranked higher chance
than the real key, so I increased the minimum key size a few values
oher than that I got the exact key length by rank 1

7 - AES in ECB - I dont think the intention of this one is to implement AES ECB Yourself
I looked into that and it would be heaps of work... instead it just seems
that you should have CODE that encrypts in AES ECB using a library

8 - Detect AES in ECB - Reasonably fast to implement - Every result has 0 repeated blocks except the one that is ECB encrypted

9 - Implement PKCS7 Padding - Quite simple and fast...

10 - Implementing CBC mode - The challenge is not so clear previously about the padding - if you try to verify your results with an online tool they will implement
the padding correctly which means if your data is an exact multiple of 16
you need another block of empty padding. So this can be confusing to
verify when you are getting different results.

      For example I was encrypting "YELLOW SUBMARINEYELLOW SUBARMINE" and ending up
      with a result that was 16 bytes shorter than the results from the internet pages!
