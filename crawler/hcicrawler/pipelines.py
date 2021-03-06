import pymongo
from hcicrawler.mongo import MongoPageQueue, MongoPageStore


class RemoveBody(object):

    def process_item(self, item, spider):
        item.pop('body', None)
        return item


class OutputQueue(object):

    def __init__(self, mongo_host, mongo_port, mongo_db, mongo_col, jobid):
        col = pymongo.Connection(mongo_host, mongo_port)[mongo_db][mongo_col]
        self.q = MongoPageQueue(col, jobid)

    @classmethod
    def from_crawler(cls, crawler):
        mongo_host = crawler.settings['MONGO_HOST']
        mongo_port = crawler.settings['MONGO_PORT']
        mongo_db = crawler.settings['MONGO_DB']
        mongo_col = crawler.settings['MONGO_QUEUE_COL']
        jobid = crawler.settings['JOBID']
        return cls(mongo_host, mongo_port, mongo_db, mongo_col, jobid)

    def process_item(self, item, spider):
        self.q.push(dict(item))
        return item


class OutputStore(object):

    def __init__(self, mongo_host, mongo_port, mongo_db, mongo_col, jobid):
        col = pymongo.Connection(mongo_host, mongo_port)[mongo_db][mongo_col]
        self.store = MongoPageStore(col, jobid)

    @classmethod
    def from_crawler(cls, crawler):
        mongo_host = crawler.settings['MONGO_HOST']
        mongo_port = crawler.settings['MONGO_PORT']
        mongo_db = crawler.settings['MONGO_DB']
        mongo_col = crawler.settings['MONGO_PAGESTORE_COL']
        jobid = crawler.settings['JOBID']
        return cls(mongo_host, mongo_port, mongo_db, mongo_col, jobid)

    def process_item(self, item, spider):
        self.store.store("%s/%s" % (item['lru'], item['size']), dict(item))
        return item
