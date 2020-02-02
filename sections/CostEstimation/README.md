# Cost estimation differences


## AWS Stack
If we talk about an AWS stack, there are some services we need to talk about. Some of them are:
- **AWS Lambda**
- **AWS API Gateway**
- **DynamoDB**
- **Amazon S3**
- **CloudWatch Logs**

Most of them, depend on lambda functions to execute the logic we need. But, to execute these lambdas, we may need to create some api endpoints, which are in charge of triggering this lambdas through the use of events. So, for our costs research, let's keep the focus on two of the services mentioned above, **AWS Lambda** and **AWS API Gateway**.

In addition, we must know the **two main units** we will handle (mixing both of them):

1. **Memory size**: This is the memory we allocate to allow a function to execute. As we are using a fixed size, if we want our costs to be lower, the only way we can do is setting this size **lower**. It is typically measured in **GB** and goes from 128MB to 3008MB in increments of 64MB.
2. **Time of execution**: It's the time duration of a lambda to execute the logic. It means that if we have third party calls, the time execution will last until this third party logic finishes, adding more time and increasing the final cost. It's commonly expressed in **ms**(milliseconds).

To calculate the **cost of a function**, we can multiply the two units above, generating a new unit, **GB-sec**.

Also, to be the most realistic as possible, we are going to talk about **two different scenarios**, a **low** compute use case, and then, a **high** one.

---

## AWS Lambda scenarios

### Low Compute Scenario (AWS Lambda pricing):

Hypothetical scenario:
- **Current lambda price:** 0,00001667 USD for each GB/s
- **Allocated Memory:** 128MB
- **Invokations/Month:** 2 million invokations/month
- **Time of execution:** 0.5 seconds
- **Monthly price for each million requests:** 0.20 USD

Calculations and charges:
- **Total computed seconds (seconds):** 2 million invokations * 0.5 seconds/invokation = 1 million seconds
- **Total computed Memory/seconds (GB/s):** 1 million * 128 / 1024 = 125000 GB/s
- **Charges for monthly computing (USD):** 125000 * 0,00001667 = 2.08375 USD
- **Charges for monthly requests (USD):** 2 million requests * 0.2 USD/(million requests) = 0.4 USD

Total:
- **Total monthly charges:** 2.08375 + 0.4 = 2.48375 USD/month

---

### High Compute Scenario (AWS Lambda pricing):

Hypothetical scenario:
- **Current lambda price:** 0,00001667 USD for each GB/s
- **Allocated Memory:** 2048MB
- **Invokations/Month:** 35 million invokations/month
- **Time of execution:** 1 seconds
- **Monthly price for each million requests:** 0.20 USD

Calculations and charges:
- **Total computed seconds (seconds):** 35 million invokations * 1 second/invokation = 35 million seconds
- **Total computed Memory/seconds (GB/s):** 35000000 * 2048 / 1024 = 70 million GB/s
- **Charges for monthly computing (USD):** 70 million * 0,00001667 = 1166.9 USD
- **Charges for monthly requests (USD):** 35 million requests * 0.2 USD/(million requests) = 7.0 USD

Total:
- **Total monthly charges:** 1166.9 + 7.0 = 1173.9 USD/month

---

## AWS API Gateway scenarios

### Low Compute Scenario (AWS API Gateway pricing):

Hypothetical scenario:
- **API price (for every million):** 3.50 USD
- **Number of API calls/month:** 1 million
- **Data transfer in each response:** 5 KB
- **Price for each GB transferred**: 0.09 USD

Calculations and charges:
- **Charges for calls to the AWS API gateway:** 1 million * 3.50 USD/million = 3.50 USD
- **Total size of transferred data:** 5KB * 1 million = 5 million/KB = 5 million / 1024 / 1024 = 2.86 GB
- **Charges for AWS API Gateway transfers**: 2.86 GB * 0.09 USD/GB = 0.25 USD

Total:
- **Total charges for using AWS API Gateway:** 3.50 USD + 0.25 USD = 3.75 USD/month

---

### High Compute Scenario (AWS API Gateway pricing):

Hypothetical scenario:
- **API price (for every million):** 3.50 USD
- **Number of API calls/month:** 20 million
- **Data transfer in each response:** 20 KB
- **Price for each GB transferred**: 0.09 USD

Calculations and charges:
- **Charges for calls to the AWS API gateway:** 20 million * 3.50 USD/million = 70 USD
- **Total size of transferred data:** 20KB * 20 million = 400 million/KB = 400 million / 1024 / 1024 = 381.46 GB
- **Charges for AWS API Gateway transfers**: 381.46 GB * 0.09 USD/GB = 34.33 USD

Total:
- **Total charges for using AWS API Gateway:** 70 USD + 34.33 USD = 104.33 USD/month