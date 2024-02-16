from datetime import datetime
from model.NOGsql import NOGsql_Model


class Usage_Data:
    
    def __init__(self):
        self.db = NOGsql_Model()
    
    ### 이달의 소비 전력량, 도시인구의 전달의 소비 전력량
    def get_chart_data_one(self, user_id, input_date=None):
        # 입력된 날짜가 없다면
        if input_date is None:
            # today = datetime.today().strftime('%Y-%m-%d')
            today = datetime.today()
            # today = str(today.year)+"-"+str(today.month)+"-"+str(today.day)
        else:
            # today = input_date
            # today = str(datetime.strptime(str(input_date), '%Y-%m-%d')).split()[0]
            today = datetime.strptime(str(input_date), '%Y-%m')
    
        sql = f"""
             SELECT 
                    `user_id`, MONTH('{today}') AS `this_month`, MONTH('{today}' - INTERVAL 1 MONTH) AS `before_city_month`,
                    IFNULL(ROUND(SUM(CASE WHEN YEAR(`date`) = YEAR('{today}') AND MONTH(`date`) = MONTH('{today}') THEN `daily_usage` ELSE 0 END), 0),0 )AS `my_total_usage`,
                    (SELECT IFNULL(ROUND(AVG(`total_usage`), 0),0 )
                    FROM (
                        SELECT SUM(`daily_usage`) AS `total_usage`
                        FROM `Jada`.`usage_data`
                        INNER JOIN `user` ON `usage_data`.`user_id` = `user`.`id` 
                        WHERE
                                `address1`=(SELECT `address1` FROM `user` WHERE `id` = '{user_id}')
                                AND `address2`=(SELECT  `address2` FROM `user` WHERE `id` = '{user_id}')
                                AND YEAR(`date`) = YEAR('{today}' - INTERVAL 1 MONTH)
                                AND MONTH(`date`) = MONTH('{today}' - INTERVAL 1 MONTH)
                        GROUP BY `user_id`
                    ) AS `monthly_totals`
                    ) AS `average_total_usage`,
                    (SELECT IFNULL(ROUND(SUM(`daily_usage`), 0),0 )
                    FROM `Jada`.`usage_data`
                    WHERE
                            `user_id` = '{user_id}' 
                            AND YEAR(`date`) = YEAR('{today}' - INTERVAL 1 MONTH)
                            AND MONTH(`date`) = MONTH('{today}' - INTERVAL 1 MONTH)
                            ) AS `my_total_usage_last`
                FROM `Jada`.`usage_data`
                WHERE 
                    `user_id` = '{user_id}'
                    AND YEAR(`date`) = YEAR('{today}')
                    AND MONTH(`date`) = MONTH('{today}');
                        
        """
    
        ### DB 에 요청하기 cursor에 담기
        # 실행 결과의 갯수
        rs_cnt = self.db.cur.execute(sql)     
        
        # 실행 결과 데이터 
        rows = self.db.cur.fetchone()
        
        # DB 정보 반환하기
        # self.db.DBClose()
        
        return rs_cnt, rows
    
        ### 나의 소비유형, 도시인구의 전달 소비유형
    def get_chart_data_two(self, user_id, input_date=None):
        # 입력 받은 날짜가 없다면
        if input_date is None:
            # today = datetime.today().strftime('%Y-%m-%d')
            today = datetime.today()
            # today = str(today.year)+"-"+str(today.month)+"-"+str(today.day)
        else:
            # today = input_date
            # today = str(datetime.strptime(str(input_date), '%Y-%m-%d')).split()[0]
            today = datetime.strptime(str(input_date), '%Y-%m')
            
        sql=f"""  SELECT
                `name` AS `user_info`,
                ROUND(IFNULL(SUM(CASE WHEN HOUR(date) IN (23,0,1,2,3,4) THEN `daily_usage` ELSE 0 END),0), 0) AS `usage_23_4`,
                ROUND(IFNULL(SUM(CASE WHEN HOUR(date) IN (5,6,7,8,9,10) THEN `daily_usage` ELSE 0 END),0), 0) AS `usage_5_10`,
                ROUND(IFNULL(SUM(CASE WHEN HOUR(date) IN (11,12,13,14,15,16) THEN `daily_usage` ELSE 0 END),0), 0) AS `usage_11_16`,
                ROUND(IFNULL(SUM(CASE WHEN HOUR(date) IN (17,18,19,20,21,22) THEN `daily_usage` ELSE 0 END),0), 0) AS `usage_17_22`
            FROM
                `usage_data`
                INNER JOIN `user` ON `usage_data`.`user_id` = `user`.`id`
            WHERE
                `user_id` = '{user_id}'
                AND YEAR(date) = YEAR('{today}')
                AND MONTH(date) = MONTH('{today}')

            UNION ALL

            SELECT
                CONCAT(`address1`," ", `address2`) AS `user_info`,
                ROUND(IFNULL(SUM(CASE WHEN HOUR(date) IN (23,0,1,2,3,4) THEN `daily_usage` ELSE 0 END) / COUNT(DISTINCT `user_id`),0), 0) AS `usage_23_4`,
                ROUND(IFNULL(SUM(CASE WHEN HOUR(date) IN (5,6,7,8,9,10) THEN `daily_usage` ELSE 0 END) / COUNT(DISTINCT `user_id`),0), 0) AS `usage_5_10`,
                ROUND(IFNULL(SUM(CASE WHEN HOUR(date) IN (11,12,13,14,15,16) THEN `daily_usage` ELSE 0 END) / COUNT(DISTINCT `user_id`),0), 0) AS `usage_11_16`,
                ROUND(IFNULL(SUM(CASE WHEN HOUR(date) IN (17,18,19,20,21,22) THEN `daily_usage` ELSE 0 END) / COUNT(DISTINCT `user_id`),0), 0) AS `usage_17_22`
            FROM
                `usage_data`
                INNER JOIN `user` ON `usage_data`.`user_id` = `user`.`id`
            WHERE
                `address1` = (SELECT `address1` FROM `user` WHERE `id` = '{user_id}')
                AND `address2` = (SELECT `address2` FROM `user` WHERE `id` = '{user_id}')
                AND YEAR(date) = YEAR('{today}' - INTERVAL 1 MONTH)
                AND MONTH(date) = MONTH('{today}' - INTERVAL 1 MONTH);
                    """
    
        ### DB 에 요청하기 cursor에 담기
        # 실행 결과의 갯수
        rs_cnt = self.db.cur.execute(sql)     
        
        # 실행 결과 데이터 
        rows = self.db.cur.fetchall()
        
        # DB 정보 반환하기
        # self.db.DBClose()
        
        return rs_cnt, rows
    
    # 사용자의 모든 사용 월을 검색해     
    def get_all_period(self, user_id):
        sql = f"""
                SELECT   DISTINCT( SUBSTRING(`date`,1,7)) AS `use_date`
                    FROM usage_data
                    WHERE user_id = '{user_id}'
                    GROUP BY DATE(`date`)
                    ORDER BY `date` DESC;

                    """
    
        ### DB 에 요청하기 cursor에 담기
        # 실행 결과의 갯수
        rs_cnt = self.db.cur.execute(sql)     
        
        # 실행 결과 데이터 
        rows = self.db.cur.fetchall()
        
        # DB 정보 반환하기
        # self.db.DBClose()
        result_list = [row['use_date'] for row in rows]
        return rs_cnt, result_list
       
     # 사용자의 모든 사용 월을 검색해     
    def get_most_used_day(self, user_id, input_date=None):
        # 입력된 날짜가 없다면
        if input_date is None:
        # today = datetime.today().strftime('%Y-%m-%d')
            today = datetime.today()
        else:
        # today = input_date
        # today = str(datetime.strptime(str(input_date), '%Y-%m-%d')).split()[0]
            today = datetime.strptime(str(input_date), '%Y-%m')
            
        sql = f"""
    
        SELECT `user_id`, round(SUM(`daily_usage`),1) AS `daily_usage`, DATE_FORMAT(`date`, '%Y-%m-%d 00:00:00') AS `date_group`
        FROM `usage_data`
        INNER JOIN `user` ON `user`.`id` = `usage_data`.`user_id`
        WHERE YEAR(`date`) = {today.year} AND MONTH(`date`) = {today.month}
        AND `address1` = (SELECT `address1` FROM `user` WHERE `id` = '{user_id}')
        AND `address2` = (SELECT `address2` FROM `user` WHERE `id` = '{user_id}')
        GROUP BY user_id, date_group;          
         """
        #  SELECT `user_id`, `daily_usage`, `date`
        # FROM `usage_data`
        # INNER JOIN `user` ON `user`.`id` = `usage_data`.`user_id`
        # WHERE
        # YEAR(`date`) = {today.year} AND MONTH(`date`) = {today.month}
        # AND `address1`=(SELECT `address1` FROM `user` WHERE `id` = '{user_id}')
        #         AND `address2`=(SELECT  `address2` FROM `user` WHERE `id` = '{user_id}');
         
        ### DB 에 요청하기 cursor에 담기
        # 실행 결과의 갯수
        rs_cnt = self.db.cur.execute(sql)     
        
        # 실행 결과 데이터 
        rows = self.db.cur.fetchall()
        
        # DB 정보 반환하기
        # self.db.DBClose()
        
        return rs_cnt, rows
    
    def get_last_year_data(self, user_id, input_date=None):
        
        # 입력된 날짜가 없다면
        if input_date is None:
            # today = datetime.today().strftime('%Y-%m-%d')
            today = datetime.today()
            # today = str(today.year)+"-"+str(today.month)+"-"+str(today.day)
        else:
            # today = input_date
            # today = str(datetime.strptime(str(input_date), '%Y-%m-%d')).split()[0]
            today = datetime.strptime(str(input_date), '%Y-%m')


        sql =f"""SELECT 
                ROUND(IFNULL(SUM(CASE WHEN `user`.id = '{user_id}' THEN usage_data.daily_usage END), 0), 1) AS user_month_total_last_year,
                ROUND(IFNULL(SUM(usage_data.daily_usage), 0), 1) AS city_month_total_last_year,
                ROUND(IFNULL((SELECT SUM(`daily_usage`)/COUNT(DISTINCT `user_id`)
                    FROM usage_data
                    INNER JOIN `user` ON user.id = usage_data.user_id
                    WHERE address1 = (SELECT address1 FROM user WHERE id = '{user_id}')
                    AND address2 = (SELECT address2 FROM user WHERE id = '{user_id}')
                    AND YEAR(`date`) = YEAR('{today}')
                    AND MONTH(`date`)= MONTH('{today}')), 0), 1) AS `city_average_daily_usage`
            FROM usage_data
            INNER JOIN `user` ON `user`.id = usage_data.user_id
            WHERE 
                `user`.address1 = (SELECT address1 FROM `user` WHERE id = '{user_id}')
                AND `user`.address2 = (SELECT address2 FROM `user` WHERE id = '{user_id}')
                AND YEAR(usage_data.`date`) = YEAR(DATE_SUB('{today}', INTERVAL 1 YEAR)) 
                AND MONTH(usage_data.`date`) = MONTH(DATE_SUB('{today}', INTERVAL 1 YEAR));
 
        """

        rs_cnt = self.db.cur.execute(sql)     
        
        # 실행 결과 데이터 
        rows = self.db.cur.fetchone()
        # DB 정보 반환하기
        # self.db.DBClose()
        
        return rs_cnt, rows
    
