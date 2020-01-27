# Cost estimation differences
## AWS Stack
If we talk about an AWS stack, there are some services we need to talk about. Some of them are:
- AWS Lambda
- AWS API Gateway
- DynamoDB
- Amazon S3
- CloudWatch Logs

Most of them, depend on lambda functions to execute the logic we need. But, to execute these lambdas, we may need to create some api endpoints, which are in charge of triggering this lambdas through the use of events. So, for our costs research, let's keep the focus on two of the services mentioned above, **AWS Lambda** and **AWS API Gateway**.

In addition, we must know the **two main units** we will handle (mixing both of them):

1. **Memory size**: This is the memory we allocate to allow a function to execute. As we are using a fixed size, if we want our costs to be lower, the only way we can do is setting this size **lower**. It is typically measured in **GB** and goes from 128MB to 3008MB in increments of 64MB.
2. **Time of execution**: It's the time duration of a lambda to execute the logic. It means that if we have third party calls, the time execution will last until this third party logic finishes, adding more time and increasing the final cost. It's commonly expressed in **ms**(milliseconds).

To calculate the **cost of a function**, we can multiply the two units above, generating a new unit, **GB-sec**.

Also, to be the most realistic as possible, we are going to talk about **two different scenarios**, a **low** compute use case, and then, a **high** one:

### Low Compute Scenario:
#### AWS Lambda

Hypothetical scenario:
- **Current lambda price:** 0,00001667 USD for each GB/s
- **Allocated Memory:** 128MB
- **Invokations/Month:** 2000000 inv/month
- **Time of execution:** 0.5 seconds
- **Monthly price for each million requests:** 0.20 USD

Calculations:
- **Total computed seconds (seconds):** 2000000 * 0.5 = 1000000 seconds
- **Total computed Memory/seconds (GB/s):** 1000000 * 128 / 1024 = 125000 GB/s

- **Charges for monthly computing (USD):** 125000 * 0,00001667 = 2.08375 USD
- **Charges for monthly requests (USD):** 2000000 requests * 0.2 USD/(million requests) = 0.4 USD

- **Total monthly charges:** 2.08375 + 0.4 = 2.48375 USD

### High Compute Scenario:
