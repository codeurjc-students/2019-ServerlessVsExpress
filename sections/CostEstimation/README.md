# Cost estimation differences


## Node.js Stack
In a typical scenario where we use a non-serverless stack with Node.js, we usually choose a predefined solution whith certain characteristics that we **more or less** know that fill fit our requirements. Although we know which will be the final monthly price from the beginning, it will not scale automaticly by itself. That means that if we want to have a better performance, we must do it manually changing our monthly plan. This will make easier for us to calculate monthly prices. For this, i will use a [tool](https://www.digitalocean.com/pricing/calculator) provided by DigitalOcean that allows us to **calculate an approximation** of the costs for different companies based on the parameters we choose.

Moreover, we should also have a Database. For this example, we will choose [MongoDB Atlas prices](https://docs.atlas.mongodb.com/billing/cluster-configuration-costs/).

### Hosting for a low compute app with a non-serverless stack (using a standard plan)

Parameters:
- **Number of CPUs:** 1
- **Storage:** 50GB
- **Memory:** 2GB
- **Transfer:** 2TB

- **Total storage:** 1TB
- **Total transfer:** 1TB

Added database costs (MongoDB Atlas):
- **Pricing plan:**
    - From 0 - 5 GB: free
    - From 5 - 100 GB: 1 USD/GB
    - From 100 - 500 GB: 0.50 USD/GB
    - More than 500 GB: 0.25 USD/GB

- **Chosen configuration:** 110 GB
- **Database monthly cost:** (95 GB * 1 USD/GB) + (10 GB * 0.5 USD/GB) = **100 USD/month**

Costs based on different companies with above's configuration plan (approx):

- **Digital Ocean:** 105 USD/month + 100 USD/month = 205 USD/month
- **AWS:** 205 USD/month + 100 USD/month = 305 USD/month
- **Google Cloud:** 179 USD/month + 100 USD/month = 279 USD/month
- **Azure:** 185 USD/month + 100 USD/month = 285 USD/month


### Hosting for a High compute app with a non-serverless stack (using a CPU-optimizad plan)

Parameters:
- **Number of CPUs:** 16
- **Storage:** 200GB
- **Memory:** 32GB
- **Transfer:** 7TB

- **Total storage:** 6TB
- **Total transfer:** 7TB

Added database costs (MongoDB Atlas):
- **Pricing plan:**
    - From 0 - 5 GB: free
    - From 5 - 100 GB: 1 USD/GB
    - From 100 - 500 GB: 0.50 USD/GB
    - More than 500 GB: 0.25 USD/GB

- **Chosen configuration:** 1000 GB
- **Database monthly cost:** (95 GB * 1 USD/GB) + (400 GB * 0.5 USD/GB) + (500 GB * 0.25 USD/GB) = **420 USD/month**

Costs based on different companies with above's configuration plan (approx):

- **Digital Ocean:** 900 USD/month + 420 USD/month = 1320 USD/month
- **AWS:** 1736 USD/month + 420 USD/month = 2156 USD/month
- **Google Cloud:** 1620 USD/month + 420 USD/month = 2040 USD/month
- **Azure:** 1604 USD/month + 420 USD/month = 2024 USD/month

---

## AWS Stack
If we talk about an AWS stack, there are some services we need to talk about. Some of them are:
- **AWS Lambda**
- **AWS API Gateway**
- **DynamoDB**
- **Amazon S3**
- **CloudWatch Logs**

Most of them, depend on lambda functions to execute the logic we need. But, to execute these lambdas, we may need to create some api endpoints, which are in charge of triggering this lambdas through the use of events. So, for our costs research, let's keep the focus on four of the services mentioned above, **AWS Lambda, AWS API Gateway, DynamoDB, Amazon S3**. The following examples will be calculated using this AWS pricing [link](https://aws.amazon.com/es/pricing/).

In addition, we must know the **two main units** we will handle (mixing both of them):

1. **Memory size**: This is the memory we allocate to allow a function to execute. As we are using a fixed size, if we want our costs to be lower, the only way we can do is setting this size **lower**. It is typically measured in **GB** and goes from 128MB to 3008MB in increments of 64MB.
2. **Time of execution**: It's the time duration of a lambda to execute the logic. It means that if we have third party calls, the time execution will last until this third party logic finishes, adding more time and increasing the final cost. It's commonly expressed in **ms**(milliseconds).

To calculate the **cost of a function**, we can multiply the two units above, generating a new unit, **GB-sec**.

Also, to be the most realistic as possible, we are going to talk about **two different scenarios**, a **low** compute use case, and then, a **high** one.

---

## AWS Lambda scenarios - Region: Ireland

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
- **Total monthly charges:** 2.08375 + 0.4 = **2.48 USD/month**


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
- **Total monthly charges:** 1166.9 + 7.0 = **1173.9 USD/month**

---

## AWS API Gateway scenarios - Region: Ireland

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
- **Total charges for using AWS API Gateway:** 3.50 USD + 0.25 USD = **3.75 USD/month**


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
- **Total charges for using AWS API Gateway:** 70 USD + 34.33 USD = **104.33 USD/month**

---

## AWS DynamoDB scenarios - Region: Ireland

As we have chosen a DynamoDB pricing based on demand (autoscalable database depending on the incoming traffic), we will create a pricing example that will simulate different periods where the traffic to the database is higher, and other where is lower:

### Low Compute Scenario (AWS DynamoDB pricing):

Hypothetical scenario:
- **Price per million writings:** 1.25 USD
- **Price per million readings:** 0.89 USD

- First 11 days:
    - **Number of writings:** 50000 writings
    - **Number of readings:** 75000 readings

- Day 12 (there was a peak):
    - **Number of writings:** 150000 writings
    - **Number of readings:** 200000 readings

- Day 13 - 30:
    - **Number of writings:** 100000 writings
    - **Number of readings:** 200000 readings

**Total calculations:**
- **Writing costs:** (50000 + 150000 + 100000) writings * 1.25 USD/million writings = 0.3 million writings * 1.25 USD/million writings = 0.37 USD/month
- **Reading costs:** (75000 + 200000 + 200000) readings * 0.89 USD/million readings = 0.475 million readings * 0.89 USD/million readings = 0.42 USD/month
- **Total monthly cost for using DynamoDB:** 0.37 + 0.42 = **0.79 USD/month**


### High Compute Scenario (AWS DynamoDB pricing):

Hypothetical scenario:
- **Price per million writings:** 1.25 USD
- **Price per million readings:** 0.89 USD

- First 11 days:
    - **Number of writings:** 5 million writings
    - **Number of readings:** 10 million readings

- Day 12 (there was a peak):
    - **Number of writings:** 20 million writings
    - **Number of readings:** 25 million readings

- Day 13 - 30:
    - **Number of writings:** 7 million writings
    - **Number of readings:** 10 million readings

**Total calculations:**
- **Writing costs:** (5 million + 20 million + 7 million) writings * 1.25 USD/million writings = 32 million writings * 1.25 USD/million writings = 40 USD/month
- **Reading costs:** (10 million + 25 million + 10 million) readings * 0.89 USD/million readings = 45 million readings * 0.89 USD/million readings = 40.05 USD/month
- **Total monthly cost for using DynamoDB:** 40 + 40.05 = **80.05 USD/month**

---

## Amazon S3 scenarios - Region: Ireland

### Lower Compute Scenario (Amazon S3 pricing):

Hypothetical scenario:
- **Price for first 50TB/month of storage:** 0.023 USD/GB
- **Price for next 450TB/month of storage:** 0.022 USD/GB
- **Price for more than 500TB/month of storage:** 0.021 USD/GB

Calculations:

- Total storage used this month: 100TB
    - First 50 TB = (50 TB * 1024 GB/TB) * 0.023 USD/GB = 1177.6 USD
    - Next 50 TB = (50 TB * 1024 GB/TB) * 0.022 USD/GB = 1126.4 USD
    - Total costs: 1177.6 + 1126.4 = **2304 USD/month**


### Higher Compute Scenario (Amazon S3 pricing):

Hypothetical scenario:
- **Price for first 50TB/month of storage:** 0.023 USD/GB
- **Price for next 450TB/month of storage:** 0.022 USD/GB
- **Price for more than 500TB/month of storage:** 0.021 USD/GB

Calculations:

- Total storage used this month: 700TB
    - First 50 TB = (50 TB * 1024 GB/TB) * 0.023 USD/GB = 1177.6 USD
    - Next 450 TB = (450 TB * 1024 GB/TB) * 0.022 USD/GB = 10137.6 USD
    - Next 200 TB = (200 TB * 1024 GB/TB) * 0.021 USD/GB = 4300.8 USD
    - Total costs: 1177.6 + 10137.6 + 4300.8 = **15616 USD/month**

---

# Summary/Comparative
As you can see in the above results, the prices depends on so many factors. To choose whether to use one or another, we must first ask ourselves some questions:

- **¿Do we often need to scale our services?** If the answer is yes, it would be a good idea to use AWS's serverless services.

- **¿Do we want to avoid surprises in our monthly costs?** As we don't really know how our app could have a small or a big amount of requests/needings, if we choose AWS serverless services, surprises may appear in total costs. This makes the **non-serverless option more affordable**. It doesn't mean that you can't put some limits to AWS to avoid this kind of things, but it is easy to forget to do it.

- **¿Is it worth to move to a serverless stack in terms of costs?** I would put here that **developers are also a cost**, and since it is a lot **easier to scale from AWS** (serverless) than from a regular stack, they will do it faster and will have less problems during the process. If it's a big app that you estimate **will grow really fast**, go for it! They will spend less time and that also saves money!


